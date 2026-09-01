"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFirebaseFirestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FeedCard, Post } from "@/components/feed/FeedCard";

export default function PostViewer({ id }: { id: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        if (typeof window !== "undefined" && !navigator.onLine) {
          throw new Error("Offline: please check your network connection");
        }

        const db = getFirebaseFirestore();
        if (!db) throw new Error("Firestore not initialized");

        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError("Post not found");
          setLoading(false);
          return;
        }
        const data = snap.data() || {};

        // defensively map fields
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
          pricePerPerson: data.price ? `${data.price}€` : undefined,
        };

        // fetch author (defensive)
        if (mapped.userID) {
          try {
            const uref = doc(db, "users", mapped.userID);
            const usnap = await getDoc(uref);
            if (usnap.exists()) {
              const ud = usnap.data() || {};
              const email = typeof ud.email === "string" ? ud.email : undefined;
              mapped.author = {
                uid: mapped.userID,
                fullName: (ud.fullName || ud.displayName) ?? undefined,
                username: ud.username ?? (email ? `@${email.split("@")[0]}` : undefined),
                profileImageURL: ud.profileImageURL ?? ud.photoURL ?? undefined,
              };
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

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} aria-label="Back" className="rounded-full bg-white/5 px-3 py-2 text-lg">
          ←
        </button>
        <div className="flex-1">
          <p className="text-sm text-zinc-400">Post</p>
        </div>
      </div>

      {loading && <div className="text-zinc-400">Loading…</div>}
      {error && <div className="text-red-400">{error}</div>}
      {post && <FeedCard post={post} />}
    </div>
  );
}
