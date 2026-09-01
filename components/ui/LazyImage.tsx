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

  // simple placeholder: gradient + spinner
  const defaultPlaceholder = (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 ${className}`} style={style}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-white/30" />
    </div>
  );

  return (
    <div ref={containerRef} className={"relative " + (className || "")} style={style} onClick={onClick}>
      {!loaded && (placeholder ?? defaultPlaceholder)}
      {loaded && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="block w-full h-full object-contain" draggable={draggable} onLoad={onLoad} onError={onError} />
      )}
      {failed && (
        <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-sm text-zinc-400">Image failed to load</div>
      )}
    </div>
  );
}
