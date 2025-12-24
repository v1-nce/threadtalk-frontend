"use client";

import Link from "next/link";
import { useState } from "react";
import { Post } from "../../lib/api";

export default function PostCard({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/post/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (err) {
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
      }
    }
  };

  return (
    <Link
      href={`/post/${post.id}`}
      className="group flex flex-col gap-1 rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-bold text-foreground">{post.username}</span>
        <span>•</span>
        <span>{formatDate(post.created_at)}</span>
      </div>

      <h3 className="text-lg font-bold leading-tight text-crust group-hover:text-primary truncate">
        {post.title}
      </h3>

      <p className="line-clamp-2 text-sm text-muted-foreground">
        {post.content}
      </p>

      <div className="mt-2 flex items-center gap-4 text-xs font-bold text-muted-foreground">
        <div className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>{post.comment_count} Comments</span>
        </div>
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-secondary/50 hover:text-primary z-10"
        >
           {copied ? (
             <>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
               <span>Copied!</span>
             </>
           ) : (
             <>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
               <span>Share</span>
             </>
           )}
        </button>
      </div>
    </Link>
  );
}