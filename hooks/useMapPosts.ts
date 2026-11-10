"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";

export type MapPost = {
  id: string;
  title?: string;
  image?: string;
  rating?: number;
  cuisine?: string;
  placeName?: string;
  city?: string;
  latitude: number;
  longitude: number;
};

function toNumber(value: unknown): number | null {
  const n = typeof value === "string" ? parseFloat(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : null;
}

type MapPostsResult = { posts: MapPost[]; total: number };

async function fetchMapPosts(): Promise<MapPostsResult> {
  const db = getFirebaseFirestore();
  if (!db) throw new Error("Firestore not initialized");

  // Load the whole collection, unsorted. Sorting by `date` would hide posts: imported posts store
  // it as a string and app posts as a Timestamp, which Firestore doesn't order together, and any
  // post without a `date` field would be skipped entirely.
  const snapshot = await getDocs(collection(db, "posts"));

  const mapped: MapPost[] = [];
  const withoutLocation: string[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const place = data.placeSelected ?? {};
    const latitude = toNumber(place.latitude);
    const longitude = toNumber(place.longitude);
    // (0, 0) is what the apps save when no place was picked, not a post in the Gulf of Guinea
    if (latitude == null || longitude == null || (latitude === 0 && longitude === 0)) {
      withoutLocation.push(doc.id);
      continue;
    }

    const firstImage = data.images?.[0];
    mapped.push({
      id: doc.id,
      title: data.name,
      image: firstImage?.uploadedURL || (typeof firstImage === "string" ? firstImage : undefined),
      rating: data.rating ? parseFloat(String(data.rating)) : undefined,
      cuisine: data.foodType,
      placeName: place.name,
      city: place.city,
      latitude,
      longitude,
    });
  }

  if (withoutLocation.length > 0) {
    console.info(`Map: ${withoutLocation.length} post(s) have no location and aren't shown`, withoutLocation);
  }
  return { posts: mapped, total: snapshot.size };
}

/** Loads every post that has coordinates, for plotting on the world map. */
export function useMapPosts() {
  const [posts, setPosts] = useState<MapPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((promise: Promise<MapPostsResult>) => {
    return promise
      .then((result) => {
        setPosts(result.posts);
        setTotal(result.total);
        setError(null);
      })
      .catch((err: unknown) => {
        console.error("Failed to load map posts", err);
        setError(err instanceof Error ? err.message : "Failed to load posts");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    apply(fetchMapPosts());
  }, [apply]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    return apply(fetchMapPosts());
  }, [apply]);

  return { posts, total, loading, error, reload };
}
