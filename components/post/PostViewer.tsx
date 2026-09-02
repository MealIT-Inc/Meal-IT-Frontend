"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getFirebaseFirestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FeedCard, type Post } from "@/components/feed/FeedCard";

export default function PostViewer({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const mode = searchParams?.get("mode") ?? null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        // resolve id fallback: try to extract from URL if prop is missing or invalid
        let resolvedId: string | null = id ?? null;
        if (!resolvedId || String(resolvedId) === "undefined" || String(resolvedId).trim() === "") {
          if (typeof window !== "undefined") {
            try {
              const sp = new URL(window.location.href).searchParams;
              const fromQuery = sp.get("id") || sp.get("postId") || sp.get("pid");
              if (fromQuery && fromQuery !== "undefined") resolvedId = fromQuery;
              else {
                const m = window.location.pathname.match(/\/post\/([^\/\?]+)/);
                if (m && m[1] && m[1] !== "undefined") resolvedId = m[1];
              }
            } catch (e) {
              // ignore URL parsing errors
            }
          }
        }

        if (!resolvedId) {
          setError("Invalid post id");
          setLoading(false);
          try {
            setTimeout(() => router.back(), 800);
          } catch (e) {
            /* ignore */
          }
          return;
        }

        if (typeof window !== "undefined" && !navigator.onLine) {
          throw new Error("Offline: please check your network connection");
        }

        const db = getFirebaseFirestore();
        if (!db) throw new Error("Firestore not initialized");

        const ref = doc(db, "posts", resolvedId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Post not found");
          setLoading(false);
          return;
        }
        const data = snap.data() || {};

        const images = Array.isArray(data.images)
          ? data.images.map((img: any) => (img && (img.uploadedURL || img.url)) || String(img || "")).filter(Boolean)
          : [];

        const imageDescriptions = Array.isArray(data.images)
          ? data.images.map((img: any) => (img && img.description) || "").filter(Boolean)
          : [];

        const mapped: Post = {
          id: snap.id,
          uid: data.uid ?? snap.id,
          userID: data.userID ?? data.uid ?? undefined,
          name: data.name ?? undefined,
          date: data.date ?? undefined,
          db_inserted: data.db_inserted ?? undefined,
          description: data.description ?? undefined,
          foodType: data.foodType ?? undefined,
          price: data.price ?? undefined,
          rating: data.rating != null ? Number(data.rating) : undefined,
          placeSelected: data.placeSelected ?? undefined,
          images,
          imageDescriptions,
          caption: data.description ?? undefined,
          title: data.name ?? undefined,
          cuisine: data.foodType ?? undefined,
          location: data.placeSelected?.city ?? undefined,
          pricePerPerson: data.price ? `${data.price}€/person` : undefined,
        };

        if (mapped.userID) {
          try {
            const uref = doc(db, "users", mapped.userID);
            const usnap = await getDoc(uref);
            if (usnap.exists()) {
              const ud = usnap.data() || {};
              const email = typeof ud.email === "string" ? ud.email : undefined;
              const username = ud.username ?? (email ? `@${email.split("@")[0]}` : undefined);
              mapped.author = {
                uid: mapped.userID,
                fullName: (ud.fullName || ud.displayName) ?? undefined,
                username,
                profileImageURL: ud.profileImageURL ?? ud.photoURL ?? undefined,
              };
              mapped.handle = username ?? mapped.handle;
            }
          } catch (innerErr) {
            console.debug("Failed to fetch author for post", innerErr);
          }
        }

        setPost(mapped);
      } catch (err: any) {
        console.error("Failed to load post", err);
        const message = err?.message || String(err) || "Failed to load post";
        setError(message.includes("ERR_BLOCKED_BY_CLIENT") ? "Network request blocked by browser extension" : message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (selectedImageIndex == null) return;
    setZoom(1);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImageIndex(null);
        setZoom(1);
      }
      if (event.key === "ArrowRight" && post?.images?.length) {
        setSelectedImageIndex((current) => {
          if (current == null) return 0;
          return Math.min(post.images.length - 1, current + 1);
        });
      }
      if (event.key === "ArrowLeft" && post?.images?.length) {
        setSelectedImageIndex((current) => {
          if (current == null) return post.images.length - 1;
          return Math.max(0, current - 1);
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, post?.images]);

  const openViewer = (index: number) => {
    if (!post?.images?.length) return;
    setSelectedImageIndex(Math.min(Math.max(0, index), post.images.length - 1));
    setZoom(1);
  };

  const closeViewer = () => {
    setSelectedImageIndex(null);
    setZoom(1);
  };

  const onZoomWheel = (event: React.WheelEvent<HTMLImageElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.2 : -0.2;
    setZoom((current) => Math.min(3, Math.max(1, Number((current + delta).toFixed(2)))));
  };

  return (
    <div className="pb-8">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg text-white transition hover:bg-white/10"
          >
            ←
          </button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Gallery</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-4">
        {loading && <div className="py-10 text-center text-zinc-400">Loading…</div>}
        {error && <div className="py-10 text-center text-red-400">{error}</div>}

        {post && mode === "card" && (
          <div className="mb-6">
            <FeedCard post={post} />
          </div>
        )}

        {post && mode !== "card" && (
          <>
            <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-zinc-400">{post.title || "Post"}</p>
              {post.description && <p className="mt-2 text-sm text-zinc-200">{post.description}</p>}
            </div>

            <div className="space-y-4">
              {post.images.map((src, index) => (
                <div key={`${src}-${index}`} className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                      <div className="block w-full text-left">
                        <img
                          src={src}
                          alt={post.title ?? `image-${index + 1}`}
                          className="block max-h-[75vh] w-full object-contain bg-black/20"
                        />
                      </div>

                      {post.imageDescriptions?.[index] && (
                        <p className="px-4 py-3 text-sm text-zinc-200">{post.imageDescriptions[index]}</p>
                      )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedImageIndex != null && post && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeViewer}
        >
          <button
            aria-label="Close image viewer"
            onClick={(event) => {
              event.stopPropagation();
              closeViewer();
            }}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-2 text-lg text-white"
          >
            ✕
          </button>

          <button
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedImageIndex((current) => {
                if (current == null) return 0;
                return Math.max(0, current - 1);
              });
              setZoom(1);
            }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-2xl text-white"
          >
            ‹
          </button>

          <button
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedImageIndex((current) => {
                if (current == null) return 0;
                return Math.min(post.images.length - 1, current + 1);
              });
              setZoom(1);
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-2xl text-white"
          >
            ›
          </button>

          <div className="relative flex h-full w-full items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img
              src={post.images[selectedImageIndex]}
              alt={post.title ?? `image-${selectedImageIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-150"
              style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease-out", touchAction: "none" }}
              onWheel={onZoomWheel}
              onDoubleClick={() => setZoom((current) => (current > 1 ? 1 : 2))}
            />
          </div>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/60 px-3 py-2">
            <button onClick={() => setZoom((current) => Math.max(1, Number((current - 0.2).toFixed(2))))} className="text-xl text-white">
              −
            </button>
            <span className="min-w-14 text-center text-sm text-white">{zoom.toFixed(1)}x</span>
            <button onClick={() => setZoom((current) => Math.min(3, Number((current + 0.2).toFixed(2))))} className="text-xl text-white">
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
