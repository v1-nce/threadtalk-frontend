"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPostDetails, Post, Comment } from "../../../lib/api";
import CommentSection from "../../../components/forum/CommentSection";

export default function PostPage() {
  const params = useParams();
  const postId = typeof params.post_id === "string" ? params.post_id : "";

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(() => {
    if (!postId) return;
    getPostDetails(postId)
      .then((data) => {
        setPost(data.post);
        setComments(data.comments || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="h-8 w-2/3 animate-pulse rounded-md bg-secondary/20 mb-4" />
        <div className="h-32 w-full animate-pulse rounded-md bg-secondary/20" />
      </div>
    );
  }

  if (!post) return <div className="text-center py-20 text-muted-foreground">Post not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px] items-start">
          
          {/* Main Content - ADDED: min-w-0 */}
          <div className="flex flex-col gap-6 min-w-0">
            
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <div className="font-bold text-foreground">{post.username}</div>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* ADDED: break-words to handle long titles */}
              <h1 className="text-2xl font-bold text-crust mb-4 leading-tight break-words">
                  {post.title}
              </h1>

              {/* ADDED: break-words to handle long content */}
              <div className="text-base text-crust/90 whitespace-pre-wrap leading-relaxed break-words">
                  {post.content}
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-xs font-bold text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {post.comment_count} Comments
                </div>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                >
                   {copied ? (
                     <>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                       Copied Link!
                     </>
                   ) : (
                     <>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                       Share
                     </>
                   )}
                </button>
              </div>
            </div>

            <CommentSection postId={postId} comments={comments} onRefresh={fetchData} />
          </div>

          <div className="hidden sticky top-24 md:flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">OP</div>
                 <h2 className="font-bold text-crust">About Author</h2>
              </div>
              <div className="text-sm">
                <p className="font-bold text-crust">{post.username}</p>
                <p className="text-xs text-muted-foreground mt-1">Original Poster</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Posting Rules</h3>
              <ul className="text-sm space-y-2 text-crust/80 list-disc pl-4 marker:text-primary">
                  <li>Be respectful to others.</li>
                  <li>No spam or self-promotion.</li>
                  <li>Keep discussions on topic.</li>
                  <li>No hate speech.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}