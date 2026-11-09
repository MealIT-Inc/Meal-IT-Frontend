"use client";

import React, { useEffect, useRef, useState } from "react";

type LazyImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  shouldLoad?: boolean; // when true starts loading
  placeholder?: React.ReactNode;
  draggable?: boolean;
  onLoad?: () => void;
  onError?: () => void;
};

export default function LazyImage({ src, alt = "", className = "", style, onClick, shouldLoad = false, placeholder, draggable = false, onLoad, onError }: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!shouldLoad || started) return;
    setStarted(true);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      if (typeof onLoad === "function") onLoad();
    };
    img.onerror = () => {
      setFailed(true);
      if (typeof onError === "function") onError();
    };

    return () => {
      // cleanup not much to do
    };
  }, [shouldLoad, started, src]);

  // Shimmer card with a fixed 4:5 shape so the slot doesn't collapse while loading
  const defaultPlaceholder = (
    <div
      aria-hidden="true"
      className="relative flex aspect-[4/5] max-h-[62vh] w-full items-center justify-center overflow-hidden bg-zinc-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(52,211,153,0.10),transparent_60%)]" />
      <div className="image-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
        <UtensilsIcon className="h-6 w-6 text-zinc-500" />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={"relative " + (className || "")} style={style} onClick={onClick}>
      {!loaded && !failed && (placeholder ?? defaultPlaceholder)}
      {loaded && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="image-fade-in block w-full h-full object-contain" draggable={draggable} />
      )}
      {failed && (
        <div className="flex aspect-[4/5] max-h-[62vh] w-full flex-col items-center justify-center gap-2 bg-zinc-900 text-sm text-zinc-500">
          <UtensilsIcon className="h-6 w-6 text-zinc-600" />
          Couldn&apos;t load image
        </div>
      )}
    </div>
  );
}

function UtensilsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10" />
      <path d="M17 21V3c-2.2 1.2-3.5 3.6-3.5 6.5V13H17" />
    </svg>
  );
}
