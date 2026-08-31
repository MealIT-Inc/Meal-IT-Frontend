import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <img src="/MealitLogo.svg" alt="MealIT logo" className="h-8 w-8 object-contain rounded-lg" />
            <span className="text-lg font-bold tracking-wide">MealIT</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
              Search
            </button>
            <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              ME
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-24 pt-4 sm:px-6">{children}</main>
      <BottomNav />
    </div>
  );
}
