"use client";

import React, { useEffect, useRef, useState } from "react";
import LazyImage from "@/components/ui/LazyImage";

type CarouselProps = {
  images: string[];
  descriptions?: string[];
  title?: string;
  onImageClick?: (index: number) => void;
  parentVisible?: boolean; // when true, start loading images
};

export default function Carousel({ images, descriptions = [], title, onImageClick, parentVisible = false }: CarouselProps) {
  const [shouldLoadStates, setShouldLoadStates] = useState<boolean[]>(() => images.map(() => false));

  useEffect(() => {
    // reset when images change
    setShouldLoadStates(images.map(() => false));
  }, [images]);

  // when parentVisible becomes true, start sequential loading of images
  useEffect(() => {
    if (!parentVisible) return;
    // if any already true, don't restart
    if (shouldLoadStates.some(Boolean)) return;
    // start with the first image
    setShouldLoadStates((s) => {
      const next = [...s];
      next[0] = true;
      return next;
    });
  }, [parentVisible]);

  const handleImageLoaded = (idx: number) => {
    setShouldLoadStates((s) => {
      const next = [...s];
      if (idx + 1 < next.length) next[idx + 1] = true;
      return next;
    });
  };

  const handleImageError = (idx: number) => {
    // treat error as a trigger to start next image
    handleImageLoaded(idx);
  };

  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIndex(0);
    dragging.current = false;
  }, [images]);

  function next() {
    setIndex((i) => Math.min(images.length - 1, i + 1));
  }
  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(images.length - 1, i)));
  }

  // Touch / pointer handling for swipe
  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch (err) {
      // ignore if pointer capture isn't available
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null || startY.current == null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    // if horizontal move dominates, treat as swipe and prevent accidental page scroll
    if (!dragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      dragging.current = true;
      try {
        e.preventDefault();
      } catch (err) {
        // ignore
      }
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    const threshold = 40; // px
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
    startY.current = null;
    dragging.current = false;
  }

  // Touch fallback for older devices with better gesture detection
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = false;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (startX.current == null || startY.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!dragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
      dragging.current = true;
      // prevent vertical scroll when horizontal swipe detected
      e.preventDefault();
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const threshold = 40;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
    startY.current = null;
    dragging.current = false;
  }

  return (
    <div
      ref={containerRef}
      className="group relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative w-full overflow-hidden bg-black/30">
        <div
          className="flex w-full transition-transform duration-300"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="flex w-full shrink-0 items-center justify-center overflow-hidden bg-zinc-950" style={{ minHeight: 200 }}>
              <LazyImage
                src={src}
                alt={title ?? `image-${i + 1}`}
                className="block max-h-[62vh] w-full cursor-pointer"
                onClick={() => onImageClick?.(i)}
                shouldLoad={shouldLoadStates[i] || i === index}
                onLoad={() => handleImageLoaded(i)}
                onError={() => handleImageError(i)}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {descriptions[index] && (
        <p className="px-4 pb-2 pt-1 text-center text-xs text-zinc-300">
          {descriptions[index]}
        </p>
      )}

      {index > 0 && (
        <button
          aria-label="Previous image"
          onClick={prev}
          className={`hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-black/40 text-white transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          ‹
        </button>
      )}

      {index < images.length - 1 && (
        <button
          aria-label="Next image"
          onClick={next}
          className={`hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-black/40 text-white transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          ›
        </button>
      )}

      <div className="mt-3 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to image ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all ${i === index ? "h-2 w-8 rounded-full bg-emerald-400" : "h-2 w-2 rounded-full bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
