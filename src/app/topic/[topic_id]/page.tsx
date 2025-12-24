"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTopics, createPost, Topic } from "../../../lib/api";
import PostList from "../../../components/forum/PostList";

export default function TopicPage() {
  const params = useParams();
  const topicId = typeof params.topic_id === "string" ? params.topic_id : "";

  const [topic, setTopic] = useState<Topic | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  // Validate Title Length (Must be at least 4 chars to satisfy backend 'min' tag)
  const isTitleValid = formData.title.trim().length >= 4;

  useEffect(() => {
    if (!topicId) return;
    
    getTopics()
      .then((topics) => {
        // Cast both to String for safe comparison
        const found = topics.find((t) => String(t.id) === String(topicId));
        if (found) setTopic(found);
      })
      .catch(console.error);
  }, [topicId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTitleValid) return;

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
      console.error(err);
      // Show the actual error from backend if available
      alert(err.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_310px] items-start">
          
          {/* Main Feed */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h1 className="text-3xl font-bold text-crust">
                  {topic ? topic.name : "Loading..."}
                </h1>
                <p className="text-muted-foreground">
                  {topic ? topic.description : "Browsing topic feed"}
                </p>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-warm active:scale-95"
              >
                Create Post
              </button>
            </div>

            <PostList key={refreshKey} topicId={topicId} />
          </div>

          {/* Sidebar */}
          <div className="hidden sticky top-24 flex-col gap-4 md:flex">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 border-b border-border pb-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  r/
                </div>
                <h2 className="font-bold text-crust">About {topic?.name || "Community"}</h2>
              </div>
              
              <div className="flex flex-col gap-2 text-sm mt-3">
                <div className="flex justify-between">
                  <span className="font-medium text-crust">Created</span>
                  <span className="text-muted-foreground">
                    {topic ? new Date(topic.created_at).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl animate-rise">
            <div className="flex items-center justify-between border-b border-border bg-secondary/20 px-6 py-4">
              <h2 className="text-lg font-bold text-crust">Create a Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-crust">✕</button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-6 space-y-5">
              <div className="space-y-1">
                <input
                  autoFocus
                  className="w-full rounded-lg border border-input bg-background p-3 text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Title"
                  maxLength={300}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {/* Visual feedback for length */}
                <div className={`flex justify-end text-xs ${!isTitleValid && formData.title.length > 0 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                    {formData.title.length < 4 && formData.title.length > 0 ? "Min 4 chars" : `${formData.title.length}/300`}
                </div>
              </div>
              
              <textarea
                className="w-full min-h-[200px] resize-none rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="Text (optional)"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
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