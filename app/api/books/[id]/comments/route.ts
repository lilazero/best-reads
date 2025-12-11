import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { ObjectId, type UpdateFilter } from "mongodb";
import { currentUser } from "@clerk/nextjs/server";

type ReplyDoc = {
  _id: ObjectId | string;
  content: string;
  authorId?: string | null;
  authorName?: string;
  createdAt: Date | string;
};

type CommentDoc = {
  _id: ObjectId;
  bookId: string;
  content: string;
  authorId?: string | null;
  authorName?: string;
  createdAt: Date;
  replies?: ReplyDoc[];
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const maybePromise = params as { then?: unknown };
  const resolvedParams =
    typeof maybePromise.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const { id } = resolvedParams;
  const db = await getDb();

  const comments = await db
    .collection<CommentDoc>("user_comments")
    .find({ bookId: id })
    .sort({ createdAt: -1 })
    .toArray();

  const normalized = comments.map((c) => ({
    ...c,
    _id: c._id.toString(),
    replies: (c.replies || []).map((r) => ({
      ...r,
      _id:
        typeof r._id === "object" && r._id && "toString" in r._id
          ? (r._id as ObjectId).toString()
          : String(r._id),
    })),
  }));

  return NextResponse.json(normalized);
}

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const { content, parentId, parentReplyId } = body as {
    content?: string;
    parentId?: string;
    parentReplyId?: string;
  };

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (parentId) {
    // add as reply to existing comment
    const reply = {
      _id: new ObjectId(),
      content,
      authorId: authorIdFromClerk,
      authorName: authorNameFromClerk,
      createdAt: new Date(),
      parentReplyId: parentReplyId ?? null,
    };

    const update: UpdateFilter<CommentDoc> = { $push: { replies: reply } };

    const u = await db
      .collection<CommentDoc>("user_comments")
      .updateOne({ _id: new ObjectId(parentId), bookId: id }, update);

    if (u.matchedCount === 0) {
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    const updatedDoc = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(parentId), bookId: id });

    if (!updatedDoc) {
      return NextResponse.json(
        { error: "Parent comment not found after update" },
        { status: 404 }
      );
    }

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

  // create top-level comment
  const doc = {
    bookId: id,
    content,
    authorId: authorIdFromClerk,
    authorName: authorNameFromClerk,
    createdAt: new Date(),
    replies: [],
  };

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

  // If editing a reply
  if (replyId) {
    const commentDoc = await db
      .collection<CommentDoc>("user_comments")
      .findOne({ _id: new ObjectId(commentId), bookId: id });
    if (!commentDoc)
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
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
        { _id: new ObjectId(commentId), "replies._id": new ObjectId(replyId) },
        { $set: { "replies.$.content": content } }
      );

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

  // Editing top-level comment
  const comment = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: new ObjectId(commentId), bookId: id });
  if (!comment)
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  if (comment.authorId !== clerkUser.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

  const commentDoc = await db
    .collection<CommentDoc>("user_comments")
    .findOne({ _id: new ObjectId(commentId), bookId: id });
  if (!commentDoc)
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });

  // deleting a reply
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

  // deleting top-level comment: if has replies -> replace content, else remove
  const hasReplies = (commentDoc.replies || []).length > 0;
  if (commentDoc.authorId !== clerkUser.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (hasReplies) {
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

  const del = await db
    .collection<CommentDoc>("user_comments")
    .deleteOne({ _id: new ObjectId(commentId) });
  if (del.deletedCount === 0)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
