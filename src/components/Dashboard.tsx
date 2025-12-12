"use client";

import { useEffect, useState } from "react";
import { getTopics, createTopic, Topic } from "../lib/api";
import TopicList from "./forum/TopicList";

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchTopics = () => {
    getTopics()
      .then(setTopics)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setCreating(true);
    try {
      await createTopic(formData);
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      fetchTopics(); // Refresh list immediately
    } catch (err) {
      alert("Failed to create topic. Name might be taken.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-crust">Communities</h1>
          <p className="text-muted-foreground">Select a topic to start browsing</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-warm active:scale-95"
        >
          + New Community
        </button>
      </div>

      {/* Content */}
      <TopicList topics={topics} loading={loading} />

      {/* Create Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-rise">
            <h2 className="mb-4 text-xl font-bold text-crust">Create Community</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  autoFocus
                  className="w-full rounded-lg border border-input bg-background p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g. BreadLovers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-lg border border-input bg-background p-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="What is this community about?"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}