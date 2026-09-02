"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getFirebaseFirestore } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, Query, limit as fbLimit, startAfter, QueryDocumentSnapshot, DocumentData, doc, getDoc } from "firebase/firestore";
import { Post } from "@/components/feed/FeedCard";

const feedCache = {
  initialized: false,
  posts: [] as Post[],
  hasMore: true,
  lastDoc: null as QueryDocumentSnapshot<DocumentData> | null,
};

export function useFeedPosts(pageSize = 10) {
  const [posts, setPosts] = useState<Post[]>(feedCache.posts);
  const [loading, setLoading] = useState(!feedCache.initialized);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(feedCache.hasMore);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(feedCache.lastDoc);
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
      pricePerPerson: data.price ? `${data.price}€/person` : undefined,
      handle: data.handle ?? data.username ?? undefined,
      user: data.user ?? data.fullName ?? undefined,
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

      // diagnostic: detect any posts that unexpectedly lack an id (shouldn't happen for Firestore documents)
      const missingId = withAuthors.filter((p) => !p.id || String(p.id) === "undefined");
      if (missingId.length > 0) {
        // use console.warn so it's visible in browser console during testing
        console.warn("useFeedPosts: fetched posts with missing id:", missingId.map((x) => ({ title: x.title, images: x.images?.slice(0,2), id: x.id })));
      }

      if (isRefresh) {
        setPosts(withAuthors);
        feedCache.posts = withAuthors;
      } else {
        const merged = [...(feedCache.posts || []), ...withAuthors];
        setPosts(merged);
        feedCache.posts = merged;
      }

      // update last doc
      if (snapshot.docs.length > 0) {
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
        feedCache.lastDoc = lastDocRef.current;
      } else {
        lastDocRef.current = null;
        feedCache.lastDoc = null;
      }

      const nextHasMore = snapshot.docs.length === pageSize;
      setHasMore(nextHasMore);
      feedCache.hasMore = nextHasMore;
      feedCache.initialized = true;
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
    if (feedCache.initialized) {
      setPosts(feedCache.posts);
      setHasMore(feedCache.hasMore);
      setLoading(false);
      return;
    }

    lastDocRef.current = null;
    feedCache.lastDoc = null;
    setPosts([]);
    setHasMore(true);
    feedCache.posts = [];
    feedCache.hasMore = true;
    fetchPage(true);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    await fetchPage(false);
  }, [hasMore, fetchPage]);

  const refresh = useCallback(async () => {
    lastDocRef.current = null;
    feedCache.lastDoc = null;
    feedCache.posts = [];
    feedCache.hasMore = true;
    setHasMore(true);
    await fetchPage(true);
  }, [fetchPage]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}
