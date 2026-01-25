"use client";

import { useState, useRef } from "react";
import { useAuthStore, usePostStore } from "../../stores";
import { validateCommentContent } from "../../lib/validation";
import ErrorToast from "../ui/ErrorToast";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { Comment } from "../../lib/api";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onRefresh: () => void;
  depth?: number;
}

export default function CommentItem({ comment, postId, onRefresh, depth = 0 }: CommentItemProps) {
  const user = useAuthStore((s) => s.user);
  const { createComment, deleteComment } = usePostStore();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const isDeleted = comment.content === "[deleted]";
  const canDelete = !isDeleted && user && String(user.id) === String(comment.user_id);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
    if (replyRef.current) {
      replyRef.current.style.height = "auto";
      replyRef.current.style.height = `${replyRef.current.scrollHeight}px`;
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setError(null);

    const contentError = validateCommentContent(replyContent);
    if (contentError) {
      setError(contentError);
      return;
    }

    setSubmitting(true);
    try {
      await createComment({ content: replyContent, post_id: postId, parent_id: comment.id });
      setIsReplying(false);
      setReplyContent("");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    try {
      await deleteComment(comment.id, postId);
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete comment");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      <div className={`flex flex-col ${depth > 0 ? "mt-4" : "mt-0"}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className={`font-bold ${isDeleted ? "opacity-60 italic" : "text-foreground"}`}>
            {comment.username}
          </span>
          <span>•</span>
          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>

        <div className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-crust"}`}>
          {comment.content}
        </div>

        <div className="flex items-center gap-4 mt-2 mb-2">
          {user && !isDeleted && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Reply
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </>
              )}
            </button>
          )}
        </div>

        {isReplying && (
          <form onSubmit={handleReply} className="mb-4 flex flex-col gap-3">
            <div className="flex gap-3 items-start border-l-2 border-border pl-4">
              <textarea
                ref={replyRef}
                autoFocus
                rows={1}
                maxLength={2000}
                className="flex-1 resize-none rounded-md border border-input bg-background p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Reply..."
                value={replyContent}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleReply(e);
                  }
                }}
                style={{ minHeight: "38px" }}
              />
              <div className="flex flex-col gap-2 shrink-0">
                <button type="submit" disabled={submitting} className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50">
                  Reply
                </button>
                <button type="button" onClick={() => setIsReplying(false)} className="px-3 py-1 text-xs font-bold text-muted-foreground hover:text-foreground text-center">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {comment.children && comment.children.length > 0 && (
          <div className="ml-1 border-l-2 border-border pl-4">
            {comment.children.map((child) => (
              <CommentItem key={child.id} comment={child} postId={postId} onRefresh={onRefresh} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this comment? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}