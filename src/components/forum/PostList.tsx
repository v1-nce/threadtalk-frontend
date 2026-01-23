"use client";

import { useEffect, useState } from "react";
import { getTopicPosts, Post } from "../../lib/api";
import PostCard from "./PostCard";

interface PostListProps {
  topicId: string;
}

export default function PostList({ topicId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    if (!topicId) return;

    getTopicPosts(topicId)
      .then((res) => {
        setPosts(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load posts:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [topicId]);

  const handleDelete = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-md border border-border/50 bg-secondary/20" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center text-muted-foreground">
        <p className="font-medium text-crust">No posts yet</p>
        <p className="text-sm">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
}