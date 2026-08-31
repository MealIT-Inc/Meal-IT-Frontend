const collections = [
  { name: "Food trends", count: 120, color: "from-pink-500 to-orange-400" },
  { name: "Healthy picks", count: 84, color: "from-emerald-500 to-teal-400" },
  { name: "Desserts", count: 64, color: "from-violet-500 to-fuchsia-400" },
  { name: "Night markets", count: 96, color: "from-sky-500 to-indigo-400" },
  { name: "Brunch spots", count: 72, color: "from-yellow-400 to-orange-500" },
  { name: "Chef favorites", count: 53, color: "from-rose-500 to-red-400" },
];

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Discover</p>
        <h1 className="mt-2 text-3xl font-bold">Explore</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((item) => (
          <div
            key={item.name}
            className={`rounded-3xl bg-gradient-to-br ${item.color} p-[1px] shadow-lg shadow-black/20`}
          >
            <div className="flex min-h-36 flex-col justify-between rounded-[calc(1.5rem-1px)] bg-zinc-950/90 p-5">
              <span className="text-sm text-zinc-300">{item.count} posts</span>
              <h2 className="text-xl font-semibold text-white">{item.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
