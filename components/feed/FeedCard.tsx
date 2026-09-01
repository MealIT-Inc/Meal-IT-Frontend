"use client";

import React, { useEffect, useState } from "react";
import Carousel from "@/components/feed/Carousel";

export type Post = {
  id?: string;
  user?: string;
  handle?: string;
  location?: string;
  images: string[]; // carousel images
  imageDescriptions?: string[];
  caption?: string;
  likes?: number;
  comments?: number;
  time?: string;
  title?: string; // dish title e.g. "Milanesa ibérica"
  cuisine?: string; // e.g. Mediterranean, Argentinian
  rating?: number; // 1..10 (allows decimals)
  pricePerPerson?: string; // e.g. "25€/person"
  // Firestore fields
  uid?: string;
  userID?: string;
  name?: string;
  date?: string;
  db_inserted?: string;
  description?: string;
  foodType?: string;
  price?: string;
  placeSelected?: {
    city?: string;
    fullAddress?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
  };
  // author info fetched from users/{uid}
  author?: {
    uid?: string;
    fullName?: string;
    username?: string;
    profileImageURL?: string;
  };
};

function ratingStyle(rating: number | undefined) {
  if (rating == null || Number.isNaN(rating)) {
    return { background: "linear-gradient(90deg,#444,#666)", textClass: "text-white" };
  }
  const value = Math.max(1, Math.min(10, rating));
  const hue = ((value - 1) / 9) * 120; // 0..120
  const h1 = `hsl(${hue} 90% 45%)`;
  const h2 = `hsl(${Math.min(150, hue + 20)} 85% 50%)`;
  const background = `linear-gradient(90deg, ${h1}, ${h2})`;
  const textClass = hue > 60 ? "text-zinc-900" : "text-white";
  return { background, textClass };
}

function formatNumber(n: number) {
  // deterministic thousands separator (commas) to avoid SSR/client locale mismatches
  if (n == null || isNaN(n)) return "0";
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function FeedCard({ post }: { post: Post }) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const rStyle = ratingStyle(post.rating);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const goToPreviousImage = () => {
    setLightboxIndex((current) => {
      if (current == null) return null;
      return Math.max(0, current - 1);
    });
  };

  const goToNextImage = () => {
    setLightboxIndex((current) => {
      if (current == null) return null;
      return Math.min(post.images.length - 1, current + 1);
    });
  };

  useEffect(() => {
    if (lightboxIndex == null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousImage();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextImage();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, post.images.length]);

  // Disable background scroll when the lightbox is open (preserve scroll position)
  useEffect(() => {
    if (typeof window === "undefined") return;

    let previousScrollY = 0;
    if (lightboxIndex != null) {
      previousScrollY = window.scrollY || 0;
      // Lock body scroll and fix position to avoid background movement
      document.body.style.position = "fixed";
      document.body.style.top = `-${previousScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      return () => {
        // Restore
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, previousScrollY);
      };
    }

    return;
  }, [lightboxIndex]);

  return (
    <article ref={rootRef} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {post.author?.profileImageURL ? (
            <img src={post.author.profileImageURL} alt={post.author.fullName ?? post.author.username} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-sm font-bold text-white">
              {((post.author?.fullName || post.user || "U").slice(0, 2) || "U").toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{post.author?.fullName ?? post.user ?? post.name ?? "Unknown"}</p>
            <p className="text-[11px] text-zinc-400">{post.author?.username ?? (post.user ? `@${post.user}` : post.location ?? post.placeSelected?.city ?? "—")}</p>
          </div>
        </div>
        <button className="text-xl text-zinc-400">⋯</button>
      </div>

      {/* Carousel (click image to open lightbox) */}
      <div className="px-0">
        <Carousel
          images={post.images}
          descriptions={post.imageDescriptions}
          title={post.title}
          parentVisible={inView}
          onImageClick={(i) => setLightboxIndex(i)}
        />
      </div>

      <div className="space-y-3 px-4 py-3">
        {/*
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-xl text-zinc-200">
            <span>♥</span>
            <span>💬</span>
            <span>✈</span>
          </div>
          <span className="text-sm text-zinc-400">{post.time}</span>
        </div> */}

        <p className="text-sm text-zinc-200">
          <span className="font-semibold text-white">{post.handle || "@" + (post.user || "user").toLowerCase()}</span> {post.caption || post.description || ""}
        </p>

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            {/* cuisine badge - left column (flex-1) */}
            <div className="flex-1">
              <div className="w-full text-center">
                <span className="inline-block w-full rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm font-medium text-zinc-200">
                  {post.cuisine || post.foodType || "—"}
                </span>
              </div>
            </div>

            {/* price badge - right column (flex-1) */}
            <div className="flex-1">
              <div className="w-full text-center">
                <span className="inline-block w-full rounded-2xl bg-zinc-800/70 px-4 py-2 text-sm font-medium text-zinc-200">
                  {post.pricePerPerson || (post.price ? `${post.price}€` : "—")}
                </span>
              </div>
            </div>
          </div>

          {/* centered rating bubble always centered regardless of siblings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md ${rStyle.textClass}`}
              style={{ background: rStyle.background }}
            >
              <span className="text-sm font-semibold">
                {post.rating != null ? Number(post.rating).toFixed(1) : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Visited {post.time || "—"} ago</span>
          <span>•</span>
          <span>Posted {post.time || "—"} ago</span>
        </div>
      </div>

      {/* Lightbox / full screen viewer */}
      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            aria-label="Close"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-2 text-white"
          >
            ✕
          </button>

          <div
            className="max-h-[90vh] max-w-[90vw] overflow-y-auto rounded-2xl p-1"
            onClick={(event) => event.stopPropagation()}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="overflow-hidden rounded-2xl bg-black/30">
                <img
                  src={post.images[lightboxIndex]}
                  alt={post.title ?? `image-${lightboxIndex + 1}`}
                  className="max-h-[80vh] max-w-[90vw] object-contain"
                  style={{ transform: "none", imageRendering: "auto" }}
                />
              </div>

              {post.imageDescriptions?.[lightboxIndex] && (
                <p className="max-w-[80vw] text-center text-sm text-zinc-100">
                  {post.imageDescriptions[lightboxIndex]}
                </p>
              )}
            </div>
          </div>

          {/* prev/next inside lightbox */}
          <button
            aria-label="Previous"
            onClick={(event) => {
              event.stopPropagation();
              goToPreviousImage();
            }}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 px-3 py-2 text-white"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={(event) => {
              event.stopPropagation();
              goToNextImage();
            }}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 px-3 py-2 text-white"
          >
            ›
          </button>
        </div>
      )}
    </article>
  );
}
