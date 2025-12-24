"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostDetails, Post, Comment } from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import PostCard from "../../../components/forum/PostCard";
import CommentSection from "../../../components/forum/CommentSection";
import { useAuth } from "../../../hooks/AuthProvider";
import AuthPage from "../../../components/AuthPage";

export default function PostPage() {
  const { post_id } = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!post_id) return;
    getPostDetails(post_id as string).then((res) => {
      setPost(res.post);
      setComments(res.comments);
      setLoading(false);
    });
  }, [post_id]);

  if (authLoading) return null;
  if (!user) return <AuthPage />;
  if (loading || !post) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <PostCard post={post} />
        <CommentSection postId={post.id} initialComments={comments} />
      </div>
    </main>
  );
}