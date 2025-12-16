"use client";

import { useState } from "react";
import { Comment, createComment } from "../../lib/api";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rootReply, setRootReply] = useState("");

  const handleRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootReply.trim()) return;

    try {
      const newComment = await createComment({
        content: rootReply,
        post_id: postId,
      });
      setComments([...comments, newComment]);
      setRootReply("");
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      <form onSubmit={handleRootComment}>
        <textarea
          className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          rows={3}
          placeholder="Leave a comment..."
          value={rootReply}
          onChange={(e) => setRootReply(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <button 
            type="submit" 
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-6">
        <h3 className="font-display text-lg font-bold border-b border-border pb-2">
          {comments.length} Comments
        </h3>
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}