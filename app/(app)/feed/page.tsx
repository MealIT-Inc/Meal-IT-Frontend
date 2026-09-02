"use client";

import { useEffect, useRef } from "react";
import { FeedCard } from "@/components/feed/FeedCard";
import { useFeedPosts } from "@/hooks/useFeedPosts";

export default function FeedPage() {
  const { posts, loading, error, hasMore, loadMore } = useFeedPosts(10);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll - observe sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loading) {
            loadMore();
          }
        });
      },
      { root: null, rootMargin: "300px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="space-y-5">
      {loading && posts.length === 0 && (
        <div className="text-center text-zinc-400">Loading posts...</div>
      )}

      {error && (
        <div className="text-center text-red-400">Error: {error}</div>
      )}

      <div className="space-y-5">
        {posts.map((post, index) => (
          <FeedCard key={post.id || `post-${index}`} post={post} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8" />

      {loading && posts.length > 0 && <div className="text-center text-zinc-400">Loading more…</div>}
      {!hasMore && <div className="text-center text-zinc-400">No more posts</div>}
    </div>
  );
}
