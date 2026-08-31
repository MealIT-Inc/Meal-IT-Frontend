const photos = [
  "https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80",
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-2xl font-bold text-zinc-950">
            ME
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Marcus</h1>
            <p className="text-sm text-zinc-400">@marcusfoodie</p>
          </div>
          <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
            Edit profile
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-white">342</p>
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
        {photos.map((photo, index) => (
          <img
            key={photo + index}
            src={photo}
            alt="User gallery"
            className="h-36 w-full rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}
