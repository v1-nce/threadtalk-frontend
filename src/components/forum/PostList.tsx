"use client";

import { useEffect } from "react";
import { usePostStore } from "../../stores";
import PostCard from "./PostCard";

interface PostListProps {
  topicId: string;
}

export default function PostList({ topicId }: PostListProps) {
  const { postsByTopic, loading, fetchTopicPosts } = usePostStore();
  const posts = postsByTopic[topicId] || [];

  useEffect(() => {
    if (topicId) {
      fetchTopicPosts(topicId);
    }
  }, [topicId, fetchTopicPosts]);

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
        <PostCard key={post.id} post={post} onDelete={() => fetchTopicPosts(topicId)} />
      ))}
    </div>
  );
}