import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { ObjectId, type UpdateFilter } from "mongodb";
import { currentUser } from "@clerk/nextjs/server";

/*
  Types used to describe the shape of comments and replies as stored in MongoDB.
  - ReplyDoc: represents a reply to a comment (may live inside a CommentDoc.replies array)
  - CommentDoc: represents a top-level comment attached to a book (stored in "user_comments")
*/
type ReplyDoc = {
  // reply id - may be an ObjectId instance from mongo or a string when serialized
  _id: ObjectId | string;
  // reply text
  content: string;
  // optional author id (null if deleted)
  authorId?: string | null;
  // optional display name of the author
  authorName?: string;
  // when the reply was created (Date in DB, string when serialized)
  createdAt: Date | string;
};

type CommentDoc = {
  // MongoDB ObjectId for the comment document
  _id: ObjectId;
  // id of the book this comment belongs to
  bookId: string;
  // comment text
  content: string;
  // optional author id (null if deleted)
  authorId?: string | null;
  // optional display name of the author
  authorName?: string;
  // creation timestamp
  createdAt: Date;
  // optional array of replies
  replies?: ReplyDoc[];
};

/*
  GET handler: returns all comments for a given book id (from route params).
  - Accepts the Next.js route params object which may be a Promise (edge/route conventions).
  - Queries the `user_comments` collection for documents matching `bookId`.
  - Sorts newest-first by `createdAt` and then normalizes ObjectId values to strings
    so the response is JSON-friendly and deterministic for the client.
*/
export async function GET(
  _req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  // params can be a plain object or a Promise (in some Next.js contexts).
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;

  // get database client
  const db = await getDb();

  // fetch all comments for this book, newest first
  const comments = await db
    .collection<CommentDoc>("user_comments")
    .find({ bookId: id })
    .sort({ createdAt: -1 })
    .toArray();

  // normalize each comment/reply _id into a string so the JSON response is stable
  const normalized = comments.map((c) => ({
    ...c,
    _id: c._id.toString(),
    replies: (c.replies || []).map((r) => ({
      ...r,
      // replies might store ObjectId or string - convert to string either way
      _id:
        typeof r._id === "object" && r._id && "toString" in r._id
          ? (r._id as ObjectId).toString()
          : String(r._id),
    })),
  }));

  // return JSON array of normalized comments
  return NextResponse.json(normalized);
}

/*
  POST handler: create a new top-level comment or a reply to an existing comment.
  Expected JSON payload:
    - content: string (required)
    - parentId?: string  -> if present, treat this as a reply to the comment with _id=parentId
    - parentReplyId?: string -> optional id for nested-reply reference
  Authorization: requires an authenticated Clerk user (currentUser())
*/
export async function POST(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;
  const body = await req.json();
  const db = await getDb();

  // Require authenticated user for posting comments/replies
  const clerkUser = await currentUser();
  if (!clerkUser) {
    // 401 if not logged in
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // derive author id and a friendly display name from Clerk user data
  const authorIdFromClerk = clerkUser.id;
  let authorNameFromClerk = "Anonymous";
  if (clerkUser.username) {
    authorNameFromClerk = String(clerkUser.username);
  } else if (clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0) {
    const email = clerkUser.emailAddresses[0].emailAddress as
      | string
      | undefined;
    if (email) authorNameFromClerk = email.split("@")[0];
  }

  // destructure payload; parentId signals a reply to an existing top-level comment
  const { content, parentId, parentReplyId } = body as {
    content?: string;
    parentId?: string;
    parentReplyId?: string;
  };

  // validate content
  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // If parentId is provided, append this payload as a reply to that comment
  if (parentId) {
    const reply = {
      _id: new ObjectId(),
      content,
      authorId: authorIdFromClerk,
      authorName: authorNameFromClerk,
      createdAt: new Date(),
      // record parentReplyId for cases where replies track which reply they are in response to
      parentReplyId: parentReplyId ?? null,
    };

    // push the new reply into the replies array of the parent comment
    const update: UpdateFilter<CommentDoc> = { $push: { replies: reply } };

    const u = await db
      .collection<CommentDoc>("user_comments")
      .updateOne({ _id: new ObjectId(parentId), bookId: id }, update);

    if (u.matchedCount === 0) {
      // parent comment not found
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    // fetch updated parent comment to return to the client
    const updatedDoc = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(parentId), bookId: id });

    if (!updatedDoc) {
      return NextResponse.json(
        { error: "Parent comment not found after update" },
        { status: 404 }
      );
    }

    // normalize object ids before returning
    const normalizedUpdated = {
      ...updatedDoc,
      _id: updatedDoc._id.toString(),
      replies: (updatedDoc.replies || []).map((r) => ({
        ...r,
        _id:
          typeof r._id === "object" && r._id && "toString" in r._id
            ? (r._id as ObjectId).toString()
            : String(r._id),
      })),
    };

    return NextResponse.json(normalizedUpdated);
  }

  // Otherwise, create a new top-level comment document
  const doc = {
    bookId: id,
    content,
    authorId: authorIdFromClerk,
    authorName: authorNameFromClerk,
    createdAt: new Date(),
    replies: [],
  };

  // insert and then fetch the created document so we can normalize and return it
  const insert = await db
    .collection<CommentDoc>("user_comments")
    .insertOne(doc as unknown as CommentDoc);
  const created = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: insert.insertedId });
  if (!created)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });

  const normalizedCreated = {
    ...created,
    _id: created._id.toString(),
    replies: (created.replies || []).map((r) => ({
      ...r,
      _id:
        typeof r._id === "object" && r._id && "toString" in r._id
          ? (r._id as ObjectId).toString()
          : String(r._id),
    })),
  };

  return NextResponse.json(normalizedCreated);
}

/*
  PATCH handler: edit an existing top-level comment or a reply.
  Expected payload:
    - commentId: id of the top-level comment (required)
    - replyId?: id of a reply to edit (if present we edit the reply)
    - content: new content for the comment/reply (required)
  Authorization: only the original author may edit their comment/reply
*/
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;
  const body = await req.json();
  const db = await getDb();

  // require authenticated user
  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId, replyId, content } = body as {
    commentId?: string;
    replyId?: string;
    content?: string;
  };
  if (!commentId || !content || content.trim() === "")
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // Editing a reply inside a comment
  if (replyId) {
    // fetch the parent comment so we can verify the reply exists and author matches
    const commentDoc = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(commentId), bookId: id });
    if (!commentDoc)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    // find the reply in the replies array
    const reply = (commentDoc.replies || []).find(
      (r) => String(r._id) === String(replyId)
    );
    if (!reply)
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });

    // only the original author may edit
    if (reply.authorId !== clerkUser.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // update the replies.$.content field using positional operator
    const u = await db
      .collection<CommentDoc>("user_comments")
      .updateOne(
        { _id: new ObjectId(commentId), "replies._id": new ObjectId(replyId) },
        { $set: { "replies.$.content": content } }
      );

    if (u.matchedCount === 0)
      return NextResponse.json({ error: "Update failed" }, { status: 500 });

    // return the updated comment document (normalized)
    const updated = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(commentId) });
    if (!updated)
      return NextResponse.json(
        { error: "Not found after update" },
        { status: 404 }
      );

    const normalized = {
      ...updated,
      _id: updated._id.toString(),
      replies: (updated.replies || []).map((r) => ({
        ...r,
        _id:
          typeof r._id === "object" && r._id && "toString" in r._id
            ? (r._id as ObjectId).toString()
            : String(r._id),
      })),
    };
    return NextResponse.json(normalized);
  }

  // Editing a top-level comment (no replyId provided)
  const comment = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: new ObjectId(commentId), bookId: id });
  if (!comment)
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  if (comment.authorId !== clerkUser.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // perform the update and re-fetch the document to return
  const u = await db
    .collection<CommentDoc>("user_comments")
    .updateOne({ _id: new ObjectId(commentId) }, { $set: { content } });
  if (u.matchedCount === 0)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });

  const updated = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: new ObjectId(commentId) });
  if (!updated)
    return NextResponse.json(
      { error: "Not found after update" },
      { status: 404 }
    );

  const normalized = {
    ...updated,
    _id: updated._id.toString(),
    replies: (updated.replies || []).map((r) => ({
      ...r,
      _id:
        typeof r._id === "object" && r._id && "toString" in r._id
          ? (r._id as ObjectId).toString()
          : String(r._id),
    })),
  };
  return NextResponse.json(normalized);
}

/*
  DELETE handler: delete a reply or a top-level comment.
  Payload:
    - commentId: id of the top-level comment (required)
    - replyId?: id of a reply to delete (if provided, only that reply is removed)

  Deletion semantics:
    - If deleting a reply, remove it from the replies array.
    - If deleting a top-level comment and it has replies, do *not* remove the document.
      Instead, replace the content with a placeholder and mark it as deleted by the user
      so the conversation/thread stays intact.
    - If deleting a top-level comment with no replies, remove the document entirely.

  Authorization: only the original author may delete their comment/reply.
*/
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;
  const body = await req.json();
  const db = await getDb();

  const clerkUser = await currentUser();
  if (!clerkUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { commentId, replyId } = body as {
    commentId?: string;
    replyId?: string;
  };
  if (!commentId)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // fetch the comment to validate existence and authorship
  const commentDoc = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: new ObjectId(commentId), bookId: id });
  if (!commentDoc)
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  // deleting a reply (remove from replies array)
  if (replyId) {
    const reply = (commentDoc.replies || []).find(
      (r) => String(r._id) === String(replyId)
    );
    if (!reply)
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    if (reply.authorId !== clerkUser.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const u = await db
      .collection<CommentDoc>("user_comments")
      .updateOne(
        { _id: new ObjectId(commentId) },
        { $pull: { replies: { _id: new ObjectId(replyId) } } }
      );
    if (u.matchedCount === 0)
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });

    const updated = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(commentId) });
    const normalized = updated
      ? {
          ...updated,
          _id: updated._id.toString(),
          replies: (updated.replies || []).map((r) => ({
            ...r,
            _id:
              typeof r._id === "object" && r._id && "toString" in r._id
                ? (r._id as ObjectId).toString()
                : String(r._id),
          })),
        }
      : null;
    return NextResponse.json(normalized);
  }

  // deleting top-level comment: if it has replies, sanitize the comment instead of removing
  const hasReplies = (commentDoc.replies || []).length > 0;
  if (commentDoc.authorId !== clerkUser.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (hasReplies) {
    // mark as deleted by user and replace content with placeholder so replies remain
    const update: UpdateFilter<CommentDoc> = {
      $set: {
        content: "[comment deleted by user]",
        authorId: null,
        authorName: "[deleted]",
        deletedByUser: true,
      },
    };
    const u = await db
      .collection<CommentDoc>("user_comments")
      .updateOne({ _id: new ObjectId(commentId) }, update);
    if (u.matchedCount === 0)
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    const updated = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(commentId) });
    const normalized = updated
      ? {
          ...updated,
          _id: updated._id.toString(),
          replies: (updated.replies || []).map((r) => ({
            ...r,
            _id:
              typeof r._id === "object" && r._id && "toString" in r._id
                ? (r._id as ObjectId).toString()
                : String(r._id),
          })),
        }
      : null;
    return NextResponse.json(normalized);
  }

  // if no replies, delete the document entirely
  const del = await db
    .collection<CommentDoc>("user_comments")
    .deleteOne({ _id: new ObjectId(commentId) });
  if (del.deletedCount === 0)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
