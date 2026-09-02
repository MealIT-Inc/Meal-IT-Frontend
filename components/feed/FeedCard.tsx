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
    return { background: "linear-gradient(135deg,#3f3f46,#52525b)", textClass: "text-white" };
  }

  const value = Math.max(1, Math.min(10, Math.round(rating)));
  const palette = [
    "hsl(0 90% 52%)",
    "hsl(8 90% 56%)",
    "hsl(18 90% 58%)",
    "hsl(30 94% 60%)",
    "hsl(42 95% 58%)",
    "hsl(55 95% 52%)",
    "hsl(72 88% 48%)",
    "hsl(94 82% 42%)",
    "hsl(118 82% 38%)",
    "hsl(140 85% 34%)",
  ];

  const color = palette[value - 1];
  const background = `linear-gradient(135deg, ${color}, ${color})`;
  const textClass = value >= 6 ? "text-zinc-950" : "text-white";

  return { background, textClass };
}

function formatNumber(n: number) {
  // deterministic thousands separator (commas) to avoid SSR/client locale mismatches
  if (n == null || isNaN(n)) return "0";
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseDateValue(value: string | number | Date | { toDate?: () => Date } | null | undefined) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const euDateMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (euDateMatch) {
      const [, day, month, yearPart] = euDateMatch;
      const year = yearPart.length === 2 ? 2000 + Number(yearPart) : Number(yearPart);
      const date = new Date(year, Number(month) - 1, Number(day));
      if (!Number.isNaN(date.getTime())) return date;
    }

    const numeric = Number(trimmed);
    if (!Number.isNaN(numeric) && String(Math.abs(numeric)).length >= 10) {
      const date = new Date(numeric);
      if (!Number.isNaN(date.getTime())) return date;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "object" && typeof value.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function formatRelativeOrExactDate(value: Post["date"] | Post["db_inserted"], now: number | null) {
  const date = parseDateValue(value);
  if (!date) return "—";

  const formattedDate = `on ${date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}`;
  if (now == null) return formattedDate;

  const diffMs = now - date.getTime();
  if (diffMs < 0) {
    return formattedDate;
  }

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return formattedDate;
}

export function FeedCard({ post }: { post: Post }) {
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    const updateNow = () => setNow(Date.now());
    updateNow();
    const interval = window.setInterval(updateNow, 1000);
    return () => window.clearInterval(interval);
  }, []);

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

  const restaurantName = post.placeSelected?.name || "Restaurant";
  const city = post.placeSelected?.city || post.location || "Unknown city";
  const authorName = post.author?.fullName || post.user || "Unknown";
  const ownerHandle =
    post.author?.username ||
    post.handle ||
    (post.user ? (post.user.startsWith("@") ? post.user : `@${post.user}`) : "@owner");

  return (
    <article ref={rootRef} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {post.author?.profileImageURL ? (
            <img src={post.author.profileImageURL} alt={authorName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-sm font-bold text-white">
              {authorName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{restaurantName}</p>
            <p className="truncate text-[11px] text-zinc-400">
              {city} <span aria-hidden="true">·</span> {authorName}
            </p>
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
          <span className="font-semibold text-white">{ownerHandle}</span> {post.caption || post.description || ""}
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
                  {post.pricePerPerson || (post.price ? `${post.price}€/person` : "—")}
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
          <span>Visited {formatRelativeOrExactDate(post.date, now)}</span>
          <span>•</span>
          <span>Posted {formatRelativeOrExactDate(post.db_inserted, now)}</span>
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
