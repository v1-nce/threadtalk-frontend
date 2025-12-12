"use client";

import Navbar from "../../../components/Navbar";
import PostList from "../../../components/forum/PostList";
import { useParams } from "next/navigation";
import { useAuth } from "../../../hooks/AuthProvider";
import AuthPage from "../../../components/AuthPage";

export default function TopicPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <AuthPage />;

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-crust">Topic Feed</h1>
          <p className="text-sm text-muted-foreground">Browsing topic #{params.topic_id}</p>
        </div>
        <PostList topicId={params.topic_id as string} />
      </div>
    </main>
  );
}