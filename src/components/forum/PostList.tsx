"use client";

import { useEffect, useState } from "react";
import { getTopicPosts, Post } from "../../lib/api";
import PostCard from "./PostCard";

export default function PostList({ topicId }: { topicId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadPosts = async (currentCursor: string = "") => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getTopicPosts(topicId, currentCursor);
      setPosts((prev) => (currentCursor === "" ? res.data : [...prev, ...res.data]));
      setCursor(res.next_cursor);
      setHasMore(!!res.next_cursor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts("");
  }, [topicId]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <button 
          onClick={() => loadPosts(cursor)}
          disabled={loading}
          className="w-full py-4 text-sm font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More Posts"}
        </button>
      )}
      
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">End of conversation.</p>
      )}
    </div>
  );
}