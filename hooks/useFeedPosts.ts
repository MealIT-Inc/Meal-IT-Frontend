"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getFirebaseFirestore } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, Query, limit as fbLimit, startAfter, QueryDocumentSnapshot, DocumentData, doc, getDoc } from "firebase/firestore";
import { Post } from "@/components/feed/FeedCard";

export function useFeedPosts(pageSize = 10) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const isFetchingRef = useRef(false);

  const mapDoc = (doc: any): Post => {
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
      pricePerPerson: data.price ? `${data.price}€` : undefined,
    } as Post;
  };

  const fetchPage = useCallback(async (isRefresh = false) => {
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
        q = query(postsRef, orderBy("date", "desc"), fbLimit(pageSize));
      } else {
        q = query(postsRef, orderBy("date", "desc"), startAfter(lastDocRef.current), fbLimit(pageSize));
      }

      const snapshot = await getDocs(q);

      const fetched = snapshot.docs.map(mapDoc);

      // fetch author/user profiles for posts in this batch
      const userIds = Array.from(new Set(fetched.map((p) => p.userID).filter((x): x is string => Boolean(x))));
      const authorMap: Record<string, { fullName?: string; username?: string; profileImageURL?: string }> = {};
      if (userIds.length > 0) {
        await Promise.all(
          userIds.map(async (uid) => {
            try {
              const ref = doc(db, "users", uid);
              const snap = await getDoc(ref);
              if (snap.exists()) {
                const d = snap.data();
                authorMap[uid] = {
                  fullName: d.fullName || d.displayName,
                  username: d.username || (d.email ? `@${d.email.split("@")[0]}` : undefined),
                  profileImageURL: d.profileImageURL || d.photoURL,
                };
              }
            } catch (err) {
              console.debug("Failed to load user for post", uid, err);
            }
          })
        );
      }

      const withAuthors = fetched.map((p) => ({ ...p, author: p.userID ? authorMap[p.userID] ?? { username: p.userID } : undefined } as Post));

      if (isRefresh) {
        setPosts(withAuthors);
      } else {
        setPosts((prev) => [...prev, ...withAuthors]);
      }

      // update last doc
      if (snapshot.docs.length > 0) {
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      }

      // if fewer than pageSize returned, no more
      setHasMore(snapshot.docs.length === pageSize);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch posts", err);
      setError(err?.message ?? "Failed to fetch posts");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [pageSize]);

  useEffect(() => {
    // initial load
    lastDocRef.current = null;
    setPosts([]);
    setHasMore(true);
    fetchPage(true);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    await fetchPage(false);
  }, [hasMore, fetchPage]);

  const refresh = useCallback(async () => {
    lastDocRef.current = null;
    setHasMore(true);
    await fetchPage(true);
  }, [fetchPage]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}
