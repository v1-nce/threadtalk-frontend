"use client";

import Link from "next/link";
import { useState } from "react";
import { Post, deletePost } from "../../lib/api";
import { useAuthStore } from "../../stores";
import ConfirmDialog from "../ui/ConfirmDialog";
import ErrorToast from "../ui/ErrorToast";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const user = useAuthStore((s) => s.user);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDeleted = post.title === "[deleted]";
  const canDelete = !isDeleted && user && String(user.id) === String(post.user_id);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    try {
      await deletePost(post.id);
      onDelete?.();
    } catch (err: any) {
      setError(err.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      <div className={`group flex flex-col gap-1 rounded-md border border-border bg-card p-4 transition-all ${isDeleted ? "" : "hover:border-primary/50 hover:bg-accent/50"}`}>
        <Link href={`/post/${post.id}`} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`font-bold ${isDeleted ? "opacity-60 italic" : "text-foreground"}`}>{post.username}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <h3 className={`text-lg font-bold leading-tight truncate ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-crust group-hover:text-primary"}`}>
            {post.title}
          </h3>
          <p className={`line-clamp-2 text-sm ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-muted-foreground"}`}>{post.content}</p>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{post.comment_count} Comments</span>
            </div>
            <button onClick={handleShare} className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50 hover:text-primary z-10">
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {canDelete && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true); }}
              disabled={deleting}
              className="flex items-center gap-1 rounded px-1 py-0.5 text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50 z-10"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Delete</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}