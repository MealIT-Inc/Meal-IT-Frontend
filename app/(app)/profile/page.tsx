"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import getFirebaseAuth from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useUserPosts } from "@/hooks/useUserPosts";
import { Post } from "@/components/feed/FeedCard";

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "ME").trim();
  if (!source) return "ME";
  const parts = source.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase not initialized");
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const displayName = profile?.fullName ?? user?.displayName ?? user?.email?.split("@")[0] ?? "Marcus";
  const username = profile?.username ?? (user?.email ? `@${user.email.split("@")[0]}` : "@marcusfoodie");
  const photoURL = profile?.profileImageURL ?? user?.photoURL ?? null;

  const { posts, loading: postsLoading, error: postsError, totalCount } = useUserPosts(user?.uid, 50);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4">
          {photoURL ? (
            <Image
              src={photoURL}
              alt={displayName}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-2xl font-bold text-zinc-950">
              {initials(profile?.fullName ?? user?.displayName, profile?.email ?? user?.email)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-zinc-400">{username}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">Edit profile</button>
            <button onClick={handleLogout} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">Logout</button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-white">{profile?.postsCount ?? totalCount ?? (postsLoading ? "…" : posts.length)}</p>
            <p className="text-xs text-zinc-400">Posts</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">18.2k</p>
            <p className="text-xs text-zinc-400">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold text-white">491</p>
            <p className="text-xs text-zinc-400">Following</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {posts.map((p: Post, idx) => (
          p?.id ? (
            <Link key={p.id} href={`/feed?user=${user?.uid ?? profile?.uid}&focus=${p.id}`} className="block">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.title ?? "post image"} width={400} height={300} className="h-36 w-full rounded-2xl object-cover" />
              ) : (
                <div className="h-36 w-full rounded-2xl bg-zinc-800" />
              )}
            </Link>
          ) : (
            <div key={`missing-id-${idx}`} className="block opacity-60">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.title ?? "post image"} width={400} height={300} className="h-36 w-full rounded-2xl object-cover" />
              ) : (
                <div className="h-36 w-full rounded-2xl bg-zinc-800" />
              )}
            </div>
          )
        ))}
      </div>

      {postsError && <div className="text-red-400">Error loading posts: {postsError}</div>}

      {postsLoading && posts.length === 0 && <div className="text-zinc-400">Loading your posts…</div>}
    </div>
  );
}
