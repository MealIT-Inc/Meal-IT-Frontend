"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const items = [
  { href: "/feed", label: "Home", iconClass: "fa-solid fa-house" },
  { href: "/explore", label: "Explore", iconClass: "fa-solid fa-compass" },
  { href: "/create", label: "Create", iconClass: "fa-solid fa-plus" },
  { href: "/notifications", label: "Alerts", iconClass: "fa-solid fa-bell" },
  { href: "/profile", label: "Profile", iconClass: "fa-solid fa-user" },
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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl md:inset-y-16 md:left-0 md:z-10 md:w-64 md:bottom-auto md:border-r md:border-t-0 md:bg-zinc-950/80 md:backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2 md:mx-0 md:max-w-none md:flex-col md:items-stretch md:justify-start md:gap-2 md:px-3 md:py-6">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className="flex flex-col items-center gap-1 px-2 py-2 text-[11px] text-zinc-400 transition hover:text-white md:flex-row md:items-center md:justify-start md:gap-3 md:rounded-xl md:px-3 md:py-3 md:text-sm md:text-zinc-300 md:hover:bg-white/5 md:hover:text-white"
          >
            <i className={`${item.iconClass} text-xl leading-none transition-transform duration-200 md:text-lg`} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
