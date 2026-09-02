"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFirebaseFirestore } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  limit as fbLimit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { Post } from "@/components/feed/FeedCard";

export function useUserPosts(userId: string | undefined | null, pageSize = 50) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const isFetchingRef = useRef(false);

  const mapDoc = useCallback((doc: any): Post => {
    const data = doc.data();
    return {
      id: doc.id,
      uid: data.uid,
      userID: data.userID,
      name: data.name,
      date: data.date,
      db_inserted: data.db_inserted,
      description: data.description,
      foodType: data.foodType,
      price: data.price,
      rating: data.rating ? parseFloat(String(data.rating)) : undefined,
      placeSelected: data.placeSelected,
      images: data.images?.map((img: any) => img.uploadedURL || img) || [],
      imageDescriptions: data.images?.map((img: any) => img.description).filter(Boolean) || [],
      caption: data.description,
      title: data.name,
      cuisine: data.foodType,
      location: data.placeSelected?.city,
      pricePerPerson: data.price ? `${data.price}€/person` : undefined,
    } as Post;
  }, []);

  const fetchCount = useCallback(async (db: any, uid: string) => {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userID", "==", uid));
      // getCountFromServer returns a AggregateQuerySnapshot
      const snap = await getCountFromServer(q as any);
      // @ts-ignore
      const cnt = snap.data().count as number;
      setTotalCount(cnt);
    } catch (err) {
      console.debug("Count aggregation not available or failed", err);
      setTotalCount(null);
    }
  }, []);

  const fetchPage = useCallback(
    async (isRefresh = false) => {
      if (!userId) return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const db = getFirebaseFirestore();
        if (!db) {
          setError("Firestore not initialized");
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }

        const postsRef = collection(db, "posts");
        let q;
        if (isRefresh || !lastDocRef.current) {
          q = query(postsRef, where("userID", "==", userId), orderBy("date", "desc"), fbLimit(pageSize));
        } else {
          q = query(postsRef, where("userID", "==", userId), orderBy("date", "desc"), startAfter(lastDocRef.current), fbLimit(pageSize));
        }

        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(mapDoc);

        // diagnostic: detect any posts that unexpectedly lack an id
        const missingId = fetched.filter((p) => !p.id || String(p.id) === "undefined");
        if (missingId.length > 0) {
          console.warn("useUserPosts: fetched posts with missing id:", missingId.map((x) => ({ title: x.title, images: x.images?.slice(0,2), id: x.id })));
        }

        if (isRefresh) {
          setPosts(fetched);
        } else {
          setPosts((prev) => [...prev, ...fetched]);
        }

        if (snapshot.docs.length > 0) {
          lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
        }

        setHasMore(snapshot.docs.length === pageSize);
        setError(null);

        // attempt to fetch count once
        if (totalCount === null) {
          await fetchCount(db, userId);
        }
      } catch (err: any) {
        console.error("Failed to fetch user posts", err);
        setError(err?.message ?? "Failed to fetch user posts");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [userId, pageSize, mapDoc, totalCount, fetchCount]
  );

  useEffect(() => {
    // reset and load initial when userId changes
    lastDocRef.current = null;
    setPosts([]);
    setHasMore(true);
    setTotalCount(null);
    if (userId) fetchPage(true);
    else setLoading(false);
  }, [userId, fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || !userId) return;
    await fetchPage(false);
  }, [hasMore, fetchPage, userId]);

  const refresh = useCallback(async () => {
    lastDocRef.current = null;
    setHasMore(true);
    await fetchPage(true);
  }, [fetchPage]);

  return { posts, loading, error, hasMore, loadMore, refresh, totalCount };
}
