"use client";

import { useEffect, useState } from "react";
import { getTopics, createTopic, Topic } from "../lib/api";
import TopicList from "./forum/TopicList";
import { validateTopicName, validateTopicDescription } from "../lib/validation";
import ErrorToast from "./ui/ErrorToast";

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTopics().then(setTopics).finally(() => setLoading(false));
  }, []);

  const filteredTopics = topics.filter((t) => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameError = validateTopicName(formData.name);
    if (nameError) {
      setError(nameError);
      return;
    }

    const descError = validateTopicDescription(formData.description);
    if (descError) {
      setError(descError);
      return;
    }

    setCreating(true);
    try {
      await createTopic(formData);
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      getTopics().then(setTopics);
    } catch (err: any) {
      setError(err.message || "Failed to create topic. Name might be taken.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px] items-start">
          
          {/* ADDED: min-w-0 prevents grid blowout */}
          <div className="flex flex-col gap-6 min-w-0">
            <h1 className="text-2xl font-bold text-crust">Communities</h1>
            
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search communities..." 
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <TopicList topics={filteredTopics} loading={loading} />
          </div>

          <div className="hidden sticky top-24 md:flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🍞</span>
                <h2 className="font-bold text-crust">Home</h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
                Welcome to ThreadTalk! Check in with your favorite communities and have fun yapping! :)
              </p>
              <hr className="border-border mb-6" />
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
              >
                Create Community
              </button>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg md:hidden hover:bg-primary/90"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-rise">
            <div className="flex items-center justify-between border-b border-border bg-secondary/10 px-6 py-4">
              <h2 className="font-bold text-crust">Create Community</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-crust">✕</button>
            </div>
            
            <form onSubmit={handleCreate} className="flex flex-col gap-4 p-6">
              {error && <ErrorToast message={error} onDismiss={() => setError(null)} />}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                <input
                  autoFocus
                  className="w-full rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="breadlovers"
                  maxLength={50}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                <textarea
                  className="w-full resize-none rounded-lg border border-input bg-background p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="What is this community about?"
                  rows={3}
                  maxLength={600}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="text-xs text-muted-foreground text-right">
                    {formData.description.length}/600
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
                <button type="submit" disabled={creating} className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50">
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