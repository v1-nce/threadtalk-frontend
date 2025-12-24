"use client";

import { useState, useRef } from "react";
import { Comment, createComment } from "../../lib/api";
import { useAuth } from "../../hooks/AuthProvider";
import { validateCommentContent } from "../../lib/validation";
import ErrorToast from "../ui/ErrorToast";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onRefresh: () => void;
  depth?: number;
}

export default function CommentItem({ comment, postId, onRefresh, depth = 0 }: CommentItemProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

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
      await createComment({
        content: replyContent,
        post_id: postId,
        parent_id: comment.id,
      });
      setIsReplying(false);
      setReplyContent("");
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col ${depth > 0 ? "mt-4" : "mt-0"}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <span className="font-bold text-foreground">{comment.username}</span>
        <span>•</span>
        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>

      <div className="text-sm text-crust leading-relaxed whitespace-pre-wrap break-words">
        {comment.content}
      </div>

      <div className="flex items-center gap-4 mt-2 mb-2">
        {user && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Reply
          </button>
        )}
      </div>

      {isReplying && (
        <form onSubmit={handleReply} className="mb-4 flex flex-col gap-3">
          {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
          <div className="flex gap-3 items-start border-l-2 border-border pl-4">
            <textarea
            ref={replyRef}
            autoFocus
            rows={1}
            // CHANGED: max=2000
            maxLength={2000}
            className="flex-1 resize-none rounded-md border border-input bg-background p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Reply..."
            value={replyContent}
            onChange={handleInput}
            style={{ minHeight: "38px" }}
          />
            <div className="flex flex-col gap-2 shrink-0">
               <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 text-xs font-bold text-muted-foreground hover:text-foreground text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="ml-1 border-l-2 border-border pl-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              onRefresh={onRefresh}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}