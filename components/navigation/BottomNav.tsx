"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const items = [
  { href: "/feed", label: "Home", icon: "⌂" },
  { href: "/explore", label: "Explore", icon: "⌕" },
  { href: "/create", label: "Create", icon: "+" },
  { href: "/notifications", label: "Alerts", icon: "♡" },
  { href: "/profile", label: "Profile", icon: "◉" },
];

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

export function BottomNav() {
  const router = useRouter();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = event.currentTarget.getAttribute("href");
    if (!target) return;

    smoothScrollToTop();
    router.push(target);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className="flex flex-col items-center gap-1 px-2 py-2 text-[11px] text-zinc-400 transition hover:text-white"
          >
            <span className="text-xl leading-none transition-transform duration-200">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
