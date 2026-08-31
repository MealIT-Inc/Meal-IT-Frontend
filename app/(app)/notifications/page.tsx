const notifications = [
  { type: "Like", text: "Ava liked your food photo.", time: "2m ago" },
  { type: "Comment", text: "Luca commented: 'This looks amazing!'.", time: "21m ago" },
  { type: "Follow", text: "Hana started following you.", time: "1h ago" },
  { type: "Mention", text: "Noah mentioned you in a reel.", time: "3h ago" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Updates</p>
        <h1 className="mt-2 text-3xl font-bold">Notifications</h1>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <div key={item.text} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 font-bold text-zinc-950">
                {item.type.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.type}</p>
                <p className="text-sm text-zinc-300">{item.text}</p>
              </div>
            </div>
            <span className="text-xs text-zinc-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
