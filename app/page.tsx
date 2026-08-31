import Link from "next/link";

const features = [
  "Instagram-style feed",
  "Google and email auth",
  "Mobile-first responsive UI",
  "Stories, explore, profile, notifications",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d1d2a,_#09090b_60%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Ready for your social app MVP
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
                MealIT Social
              </h1>
              <p className="max-w-xl text-lg text-zinc-300">
                A mobile-first social experience inspired by Instagram, with a clean feed,
                stories, profile, create post flow, and auth screens for Google and email/password.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Sign in
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                View demo feed
              </Link>
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-base font-black text-zinc-950">
                  M
                </div>
                <div>
                  <p className="font-semibold">MealIT</p>
                  <p className="text-sm text-zinc-400">Social app starter</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                Live
              </span>
            </div>

            <div className="mt-8 space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-xs font-bold text-white">
                    ✓
                  </span>
                  <span className="text-sm text-zinc-200">{feature}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
