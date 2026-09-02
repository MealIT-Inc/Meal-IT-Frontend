"use client";

import { useEffect, useRef, useState } from "react";
import { FeedCard } from "@/components/feed/FeedCard";
import { useFeedPosts } from "@/hooks/useFeedPosts";

const REFRESH_THRESHOLD = 90;

export default function FeedPage() {
  const { posts, loading, error, hasMore, loadMore, refresh } = useFeedPosts(10);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (window.scrollY > 0 || refreshing) return;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current == null || refreshing) return;

    const currentY = event.touches[0]?.clientY ?? touchStartY.current;
    const delta = currentY - touchStartY.current;

    if (delta <= 0 || window.scrollY > 0) {
      return;
    }

    const nextDistance = Math.min(140, delta * 0.6);
    setPullDistance(nextDistance);
    event.preventDefault();
  };

  const handleTouchEnd = async () => {
    if (touchStartY.current == null) return;

    const shouldRefresh = pullDistance >= REFRESH_THRESHOLD;
    touchStartY.current = null;

    if (shouldRefresh && !refreshing) {
      setRefreshing(true);
      setPullDistance(REFRESH_THRESHOLD);
      try {
        await refresh();
      } finally {
        setPullDistance(0);
        setRefreshing(false);
      }
      return;
    }

    setPullDistance(0);
  };

  return (
    <div
      className="relative"
      style={{ touchAction: "pan-y" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-center transition-all duration-200"
        style={{
          height: 54,
          transform: `translateY(${Math.max(0, pullDistance - 54)}px)`,
          opacity: pullDistance > 0 || refreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-3 py-2 text-xs font-medium text-zinc-200 shadow-lg backdrop-blur-sm">
          <div className={`h-4 w-4 rounded-full border-2 border-zinc-600 border-t-white ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing" : pullDistance >= REFRESH_THRESHOLD ? "Release to refresh" : "Pull to refresh"}</span>
        </div>
      </div>

      <div
        className="space-y-5 transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {loading && posts.length === 0 && <div className="text-center text-zinc-400">Loading posts...</div>}

        {error && <div className="text-center text-red-400">Error: {error}</div>}

        <div className="space-y-5">
          {posts.map((post, index) => (
            <FeedCard key={post.id || `post-${index}`} post={post} />
          ))}
        </div>

        <div ref={sentinelRef} className="h-8" />

        {loading && posts.length > 0 && <div className="text-center text-zinc-400">Loading more…</div>}
        {!hasMore && <div className="text-center text-zinc-400">No more posts</div>}
      </div>
    </div>
  );
}
