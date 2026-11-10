import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FirebaseAuthWarmup } from "@/components/auth/FirebaseAuthWarmup";

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const HERO_IMAGE = "photo-1414235077428-338989a2e8c0";
const AVATARS = [
  "photo-1540189549336-e6e99c3679fe",
  "photo-1567620905732-2d1ec7ab7445",
  "photo-1504674900247-0877df9cc836",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      <FirebaseAuthWarmup />

      {/* Same green glow as the landing page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_top,_rgba(1,191,98,0.22),_transparent_60%)]"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:px-8 lg:py-8">
        {/* Form column */}
        <div className="flex flex-col">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/icon-192.png" alt="" width={36} height={36} className="rounded-xl" />
              <span className="text-lg font-black tracking-tight">MealIT</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              <i className="fa-solid fa-arrow-left text-xs" aria-hidden />
              Back home
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Photo column (desktop only) */}
        <aside className="relative hidden overflow-hidden rounded-[40px] border border-white/10 lg:block">
          <Image
            src={unsplash(HERO_IMAGE, 1200)}
            alt="Restaurant dining room with set tables"
            fill
            priority
            sizes="560px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          <div className="absolute right-6 top-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm shadow-xl backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#01bf62]/15 text-[#01bf62]">
              <i className="fa-solid fa-map-pin" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Pinned on the map</span>
              <span className="block text-xs text-zinc-400">Barcelona, Spain</span>
            </span>
          </div>

          <div className="absolute inset-x-8 bottom-8 space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#01bf62]/30 bg-[#01bf62]/10 px-3 py-1.5 text-sm text-[#c0ff71] backdrop-blur">
              <i className="fa-solid fa-utensils text-xs" aria-hidden />
              The social network for restaurant lovers
            </span>
            <h2 className="text-4xl font-black leading-[1.05] tracking-tight">
              Every great meal deserves to be{" "}
              <span className="bg-gradient-to-r from-[#01bf62] via-[#7fdc5a] to-[#c0ff71] bg-clip-text text-transparent">
                shared.
              </span>
            </h2>
            <div className="flex items-center gap-4 text-sm text-zinc-300">
              <div className="flex -space-x-2">
                {AVATARS.map((id) => (
                  <Image
                    key={id}
                    src={unsplash(id, 80)}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  />
                ))}
              </div>
              Post, rate and pin the places you love
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
