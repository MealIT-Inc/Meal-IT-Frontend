"use client";

import dynamic from "next/dynamic";
import { useMapPosts } from "@/hooks/useMapPosts";

// Leaflet needs `window`, so the map only renders in the browser.
const PostsMap = dynamic(() => import("@/components/map/PostsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-zinc-900" />,
});

export default function MapPage() {
  const { posts, total, loading, error, reload } = useMapPosts();
  const missing = total - posts.length;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Around the world</p>
          <h1 className="mt-2 text-3xl font-bold">Map</h1>
        </div>
        {!loading && !error && (
          <div className="text-right text-sm text-zinc-400">
            <p>
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
            {missing > 0 && <p className="text-xs text-zinc-500">{missing} without location</p>}
          </div>
        )}
      </div>

      {/* `isolate` keeps Leaflet's high z-index layers below the app header and nav */}
      <div className="relative isolate h-[calc(100dvh-14rem)] min-h-[360px] overflow-hidden rounded-3xl border border-white/10">
        <PostsMap posts={posts} />

        {error && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-3 bg-zinc-950/80 text-sm">
            <p className="text-zinc-300">Couldn&apos;t load posts.</p>
            <button onClick={reload} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20">
              Try again
            </button>
          </div>
        )}
        {loading && (
          <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-zinc-950/80 px-4 py-1.5 text-xs text-zinc-300">
            Loading posts…
          </div>
        )}
      </div>
    </div>
  );
}
