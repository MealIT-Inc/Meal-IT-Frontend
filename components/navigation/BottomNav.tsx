import Link from "next/link";

const items = [
  { href: "/feed", label: "Home", icon: "⌂" },
  { href: "/explore", label: "Explore", icon: "⌕" },
  { href: "/create", label: "Create", icon: "+" },
  { href: "/notifications", label: "Alerts", icon: "♡" },
  { href: "/profile", label: "Profile", icon: "◉" },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-2 py-2 text-[11px] text-zinc-400 transition hover:text-white"
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
