"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";

interface Reply {
  _id: string;
  content: string;
  authorId?: string | null;
  authorName?: string;
  createdAt?: string;
  parentReplyId?: string | null;
}

interface Comment {
  _id: string;
  content: string;
  authorId?: string | null;
  authorName?: string;
  createdAt?: string;
  replies?: Reply[];
  deletedByUser?: boolean;
}

export default function BookCommentsThreaded({ bookId }: { bookId: string }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [replyFor, setReplyFor] = useState<{
    commentId: string;
    parentReplyId?: string;
  } | null>(null);
  const [replyValue, setReplyValue] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyValue, setEditReplyValue] = useState("");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  const postComment = async (topCommentId?: string, parentReplyId?: string) => {
    const payload: {
      content: string;
      parentId?: string;
      parentReplyId?: string;
    } = { content: topCommentId ? replyValue : value };
    if (topCommentId) {
      payload.parentId = topCommentId;
      if (parentReplyId) payload.parentReplyId = parentReplyId;
    }

    const res = await fetch(`/api/books/${bookId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setValue("");
      setReplyValue("");
      setReplyFor(null);
      await fetchComments();
    } else {
      const err = await res.json();
      alert(err?.error || "Failed to post comment");
    }
  };

  const handleDelete = async ({
    commentId,
    replyId,
  }: {
    commentId: string;
    replyId?: string;
  }) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/books/${bookId}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, replyId }),
    });
    if (res.ok) {
      await fetchComments();
    } else {
      const err = await res.json();
      alert(err?.error || "Failed to delete");
    }
  };

  const handleEditSave = async ({
    commentId,
    replyId,
    content,
  }: {
    commentId: string;
    replyId?: string;
    content: string;
  }) => {
    const res = await fetch(`/api/books/${bookId}/comments`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, replyId, content }),
    });
    if (res.ok) {
      setEditingCommentId(null);
      setEditValue("");
      setEditingReplyId(null);
      setEditReplyValue("");
      await fetchComments();
    } else {
      const err = await res.json();
      alert(err?.error || "Failed to save");
    }
  };

  // helper: build nested tree from flat replies array (each reply has parentReplyId or null)
  function buildReplyTree(replies: Reply[]) {
    const map = new Map<string, Reply & { children?: Reply[] }>();
    const roots: (Reply & { children?: Reply[] })[] = [];
    replies.forEach((r) => map.set(r._id, { ...r, children: [] }));
    map.forEach((node) => {
      const parentId = node.parentReplyId || null;
      if (parentId && map.has(parentId)) {
        map.get(parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  function ReplyNode({
    node,
    depth,
    topCommentId,
  }: {
    node: Reply & { children?: Reply[] };
    depth: number;
    topCommentId: string;
  }) {
    return (
      <div
        style={{ marginLeft: depth * 12 }}
        className={`pl-4 border-l ${depth > 0 ? "mt-2" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {node.authorName || "Anon"} •{" "}
            {new Date(node.createdAt || "").toLocaleString()}
          </div>
          {isLoaded &&
            user &&
            user.id &&
            node.authorId &&
            user.id === node.authorId && (
              <div className="ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreHorizontalIcon className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingReplyId(node._id);
                        setEditReplyValue(node.content || "");
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        handleDelete({
                          commentId: topCommentId,
                          replyId: node._id,
                        })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
        </div>

        <div className="mt-1">
          {editingReplyId === node._id ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editReplyValue}
                onChange={(e) => setEditReplyValue(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() =>
                    handleEditSave({
                      commentId: topCommentId,
                      replyId: node._id,
                      content: editReplyValue,
                    })
                  }
                  disabled={!editReplyValue.trim()}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => {
                    setEditingReplyId(null);
                    setEditReplyValue("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>{node.content}</div>
          )}
        </div>

        <div className="mt-2">
          <button
            className="text-sm text-blue-600"
            onClick={() =>
              setReplyFor({ commentId: topCommentId, parentReplyId: node._id })
            }
          >
            Reply
          </button>
        </div>

        {(node.children || []).map((child) => (
          <ReplyNode
            key={child._id}
            node={child as Reply & { children?: Reply[] }}
            depth={depth + 1}
            topCommentId={topCommentId}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      <div className="mb-4">
        {!isLoaded ? (
          <div>Loading...</div>
        ) : isSignedIn ? (
          <>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded"
                onClick={() => postComment()}
                disabled={!value.trim()}
              >
                Post Comment
              </button>
            </div>
          </>
        ) : (
          <div>
            <span className="mr-2">Sign in to post comments</span>
            <SignInButton>
              <button className="px-3 py-2 bg-blue-600 text-white rounded">
                Sign in
              </button>
            </SignInButton>
          </div>
        )}
      </div>

      {loading && <div>Loading comments...</div>}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="p-3 border rounded">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-3">
                <span>{c.authorName || "Anon"}</span>
                {!c.deletedByUser && isLoaded && isSignedIn && (
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => setReplyFor({ commentId: c._id })}
                  >
                    Reply
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-neutral-500">
                  {new Date(c.createdAt || "").toLocaleString()}
                </div>
                {isLoaded &&
                  user &&
                  user.id &&
                  c.authorId &&
                  user.id === c.authorId &&
                  !c.deletedByUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreHorizontalIcon className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCommentId(c._id);
                            setEditValue(c.content || "");
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete({ commentId: c._id })}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>
            </div>

            <div className="mt-2">
              {c.deletedByUser ? (
                <em className="text-neutral-500">[comment deleted by user]</em>
              ) : editingCommentId === c._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() =>
                        handleEditSave({ commentId: c._id, content: editValue })
                      }
                      disabled={!editValue.trim()}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditValue("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>{c.content}</div>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {/* render threaded replies */}
              {buildReplyTree(c.replies || []).map((root) => (
                <ReplyNode
                  key={root._id}
                  node={root as Reply & { children?: Reply[] }}
                  depth={0}
                  topCommentId={c._id}
                />
              ))}
            </div>

            <div className="mt-3">
              {!c.deletedByUser && replyFor && replyFor.commentId === c._id && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={replyValue}
                    onChange={(e) => setReplyValue(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => postComment(c._id, replyFor.parentReplyId)}
                      disabled={!replyValue.trim()}
                    >
                      Reply
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded"
                      onClick={() => {
                        setReplyFor(null);
                        setReplyValue("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
