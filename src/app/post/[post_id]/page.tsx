"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostDetails, Post, Comment, deletePost } from "../../../lib/api";
import CommentSection from "../../../components/forum/CommentSection";
import { useAuth } from "../../../hooks/AuthProvider";
import ErrorToast from "../../../components/ui/ErrorToast";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = typeof params.post_id === "string" ? params.post_id : "";

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!post) return;
    setShowConfirm(false);
    setDeleting(true);
    try {
      await deletePost(post.id);
      try {
        const data = await getPostDetails(post.id);
        setPost(data.post);
      } catch (e) {
        router.push(`/topic/${post.topic_id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const isDeleted = post?.title === "[deleted]";
  const canDelete = !isDeleted && user && post && String(user.id) === String(post.user_id);

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
    <>
      {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}

      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px] items-start">

            <div className="flex flex-col gap-6 min-w-0">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <div className={`font-bold ${isDeleted ? "opacity-60 italic" : "text-foreground"}`}>{post.username}</div>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>

                <h1 className={`text-2xl font-bold mb-4 leading-tight break-words ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-crust"}`}>
                  {post.title}
                </h1>

                <div className={`text-base whitespace-pre-wrap leading-relaxed break-words ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-crust/90"}`}>
                  {post.content}
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-muted-foreground border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {post.comment_count} Comments
                    </div>

                    <button onClick={handleShare} className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                      {copied ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied Link!
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                          Share
                        </>
                      )}
                    </button>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => setShowConfirm(true)}
                      disabled={deleting}
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deleting ? (
                        <>
                          <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete Post
                        </>
                      )}
                    </button>
                  )}
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
                  <p className={`font-bold ${isDeleted ? "opacity-60 italic text-muted-foreground" : "text-crust"}`}>{post.username}</p>
                  <p className="text-xs text-muted-foreground mt-1">Original Poster</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Comment Rules</h3>
                <ul className="text-sm space-y-2 text-crust/80 list-disc pl-4 marker:text-primary">
                  <li>Be respectful and constructive.</li>
                  <li>Stay on topic with the post.</li>
                  <li>No personal attacks.</li>
                  <li>Max 2000 characters.</li>
                </ul>
              </div>
            </div>

          </div>
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