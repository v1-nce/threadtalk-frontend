"use client";

import { useState, useRef } from "react";
import { Comment, createComment } from "../../lib/api";
import CommentItem from "./CommentItem";
import { useAuth } from "../../hooks/AuthProvider";
import { validateCommentContent } from "../../lib/validation";
import ErrorToast from "../ui/ErrorToast";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onRefresh: () => void;
}

export default function CommentSection({ postId, comments, onRefresh }: CommentSectionProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);

    const contentError = validateCommentContent(content);
    if (contentError) {
      setError(contentError);
      return;
    }

    setSubmitting(true);
    try {
      await createComment({ content, post_id: postId });
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border bg-secondary/5 p-4">
        {user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
            <div className="flex gap-3 items-start">
              <textarea
                ref={textareaRef}
                rows={1}
                maxLength={2000}
                className="flex-1 resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                placeholder="What are your thoughts?"
                value={content}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{ minHeight: "44px" }}
              />
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-2">
            Log in to participate in the discussion.
          </div>
        )}
      </div>

      <div className="max-h-[800px] overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-6">
          {comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 opacity-60">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onRefresh={onRefresh}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}