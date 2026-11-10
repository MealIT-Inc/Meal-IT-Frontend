"use client";

import { createPortal } from "react-dom";

export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-white/30 border-t-white ${className}`} aria-hidden="true" />;
}

// Rendered into <body> so the auth card's backdrop-blur doesn't confine the fixed overlay.
// Only shown after a user action, so `document` is always available.
export function AuthLoadingOverlay({ message = "Signing you in…" }: { message?: string }) {
  return createPortal(
    <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-zinc-950/80 text-white backdrop-blur-sm">
      <Spinner className="h-10 w-10 border-4" />
      <p className="text-sm text-zinc-300">{message}</p>
    </div>,
    document.body,
  );
}
