"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTopics, createPost, getTopicPosts, Topic, Post } from "../../../lib/api";
import PostCard from "../../../components/forum/PostCard";
import { validatePostTitle, validatePostContent } from "../../../lib/validation";
import ErrorToast from "../../../components/ui/ErrorToast";

export default function TopicPage() {
  const params = useParams();
  const topicId = typeof params.topic_id === "string" ? params.topic_id : "";
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTitleValid = formData.title.trim().length >= 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);

    Promise.all([
      getTopics().then((topics) => {
        const found = topics.find((t) => String(t.id) === String(topicId));
        if (found) setTopic(found);
      }),
      getTopicPosts(topicId, "", activeSearch).then((res) => {
        setPosts(res.data || []);
      })
    ])
      .catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [topicId, activeSearch, refreshKey]);


  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const titleError = validatePostTitle(formData.title);
    if (titleError) {
      setError(titleError);
      return;
    }

    const contentError = validatePostContent(formData.content);
    if (contentError) {
      setError(contentError);
      return;
    }

    setSubmitting(true);
    try {
      await createPost({
        title: formData.title,
        content: formData.content,
        topic_id: topicId
      });
      setIsModalOpen(false);
      setFormData({ title: "", content: "" });
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_310px] items-start">

          <div className="flex flex-col gap-6 min-w-0">
            <div className="flex flex-col gap-4 border-b border-border pb-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold text-crust break-all leading-tight">
                    {topic ? topic.name : "Loading..."}
                  </h1>
                  <p className="text-muted-foreground mt-1 break-words">
                    {topic ? topic.description : "Browsing topic feed"}
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="md:hidden shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  Create Post
                </button>
              </div>

              {/* SEARCH BAR */}
              <div className="relative group">
                <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input
                  type="text"
                  placeholder={`Search in ${topic?.name || "community"}...`}
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-24 w-full animate-pulse rounded-md bg-secondary/10" />)
              ) : posts.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
                  <p className="font-medium text-crust">No posts found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={() => {
                      getTopicPosts(topicId, "", activeSearch).then((res) => {
                        setPosts(res.data || []);
                      });
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <div className="hidden sticky top-24 flex-col gap-4 md:flex">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                <h2 className="font-bold text-crust break-all">
                  About {topic?.name || "Community"}
                </h2>
              </div>

              <div className="flex flex-col gap-2 text-sm mt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-crust">Created</span>
                  <span className="text-muted-foreground">
                    {topic ? new Date(topic.created_at).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 w-full rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
              >
                Create Post
              </button>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl animate-rise">
            <div className="flex items-center justify-between border-b border-border bg-secondary/20 px-6 py-4">
              <h2 className="text-lg font-bold text-crust">Create a Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-crust">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-5">
              {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
              <div className="space-y-1">
                <input
                  autoFocus
                  className="w-full rounded-lg border border-input bg-background p-3 text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Title"
                  maxLength={250}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <div className={`flex justify-end text-xs ${!isTitleValid && formData.title.length > 0 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                  {formData.title.length < 5 && formData.title.length > 0 ? "Min 5 chars" : `${formData.title.length}/250`}
                </div>
              </div>

              <textarea
                className="w-full min-h-[200px] resize-none rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Text (optional)"
                maxLength={600}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <div className="text-xs text-muted-foreground text-right -mt-2">
                {formData.content.length}/600
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-border px-5 py-2 text-sm font-bold text-muted-foreground hover:bg-secondary/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isTitleValid}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}