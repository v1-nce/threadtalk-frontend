"use client";

import { useState } from "react";
import { Comment, createComment } from "../../lib/api";

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

export default function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [children, setChildren] = useState<Comment[]>(comment.children || []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    try {
      const newComment = await createComment({
        content: replyContent,
        post_id: comment.post_id,
        parent_id: comment.id,
      });
      setChildren([...children, newComment]);
      setIsReplying(false);
      setReplyContent("");
    } catch (err) {
      alert("Failed to reply");
    }
  };

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-4 border-l-2 border-border pl-4" : ""}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="text-foreground font-bold">{comment.username}</span>
        <span>•</span>
        <span>{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>

      <div className="mt-1 text-sm text-foreground/90">{comment.content}</div>

      <button 
        onClick={() => setIsReplying(!isReplying)}
        className="mt-2 text-xs font-medium text-muted-foreground hover:text-primary"
      >
        Reply
      </button>

      {isReplying && (
        <form onSubmit={handleReply} className="mt-2 animate-fade-up">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Write your reply..."
            rows={2}
          />
          <div className="mt-2 flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">Submit</button>
            <button type="button" onClick={() => setIsReplying(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </form>
      )}

      {children.map((child) => (
        <CommentItem key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );
}