"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";

function smoothScrollToTop() {
  if (typeof window === "undefined") return;

  const currentY = window.scrollY || 0;
  if (currentY === 0) return;

  const start = performance.now();
  const duration = 220;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    window.scrollTo({ top: currentY * (1 - eased), behavior: "auto" });

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function AppShell({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const avatarUrl = profile?.profileImageURL || user?.photoURL || null;
  const initials = (() => {
    const source = profile?.fullName || user?.displayName || user?.email || "ME";
    if (!source) return "ME";
    const parts = source.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  })();

  const goTo = (href: string) => {
    smoothScrollToTop();
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/feed" onClick={(event) => { event.preventDefault(); goTo("/feed"); }} className="flex items-center gap-2">
            <Image src="/MealitLogo.svg" alt="MealIT logo" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-lg font-bold tracking-wide">MealIT</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/profile" onClick={(event) => { event.preventDefault(); goTo("/profile"); }} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm font-semibold">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile" width={36} height={36} className="h-full w-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-24 pt-4 sm:px-6">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RequireAuth>
        <AppShell>{children}</AppShell>
      </RequireAuth>
    </AuthProvider>
  );
}
