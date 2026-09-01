"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import getFirebaseAuth, { getFirebaseFirestore } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type AppUserProfile = {
  uid: string;
  fullName?: string;
  username?: string;
  email?: string;
  bio?: string;
  profileImageURL?: string;
  postsCount?: number;
  authProvider?: string;
  searchName?: string[];
};

type AuthContextValue = {
  user: User | null;
  profile: AppUserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true });

function buildSearchVariants(fullName?: string | null, email?: string | null) {
  const variants = new Set<string>();
  const baseName = (fullName || email || "").trim();

  if (baseName) {
    const normalized = baseName.toLowerCase();
    variants.add(normalized);
    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      variants.add(parts.join(""));
      variants.add(parts[0]);
      variants.add(parts[1]);
      variants.add(parts[0] + parts[1]);
    }
  }

  if (email) {
    const localPart = email.split("@")[0].toLowerCase();
    variants.add(localPart);
    const nameTokens = localPart.replace(/[._-]+/g, " ").split(/\s+/).filter(Boolean);
    nameTokens.forEach((token) => variants.add(token));
  }

  return Array.from(variants).filter(Boolean).slice(0, 20);
}

async function ensureUserProfile(u: User) {
  const db = getFirebaseFirestore();
  if (!db) return null;

  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const fullName = u.displayName || (u.email ? u.email.split("@")[0] : "User");
    const username = `@${(u.email || "user").split("@")[0].toLowerCase()}`;
    const payload = {
      uid: u.uid,
      fullName,
      username,
      email: u.email ?? "",
      bio: "",
      profileImageURL: u.photoURL ?? "",
      postsCount: 0,
      authProvider: u.providerData?.[0]?.providerId ?? "firebase",
      searchName: buildSearchVariants(fullName, u.email),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, payload, { merge: true });
    return payload as AppUserProfile;
  }

  return snap.data() as AppUserProfile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        try {
          const nextProfile = await ensureUserProfile(u);
          setProfile(nextProfile ?? {
            uid: u.uid,
            fullName: u.displayName ?? undefined,
            email: u.email ?? undefined,
            profileImageURL: u.photoURL ?? undefined,
            username: u.email ? `@${u.email.split("@")[0]}` : undefined,
            postsCount: 0,
          });
        } catch (err) {
          console.error("Failed to load or create user profile", err);
          setProfile({
            uid: u.uid,
            fullName: u.displayName ?? undefined,
            email: u.email ?? undefined,
            profileImageURL: u.photoURL ?? undefined,
            username: u.email ? `@${u.email.split("@")[0]}` : undefined,
            postsCount: 0,
          });
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
