"use client";

import React, { useEffect, useRef, useState } from "react";

type CarouselProps = {
  images: string[];
  title?: string;
  onImageClick?: (index: number) => void;
};

export default function Carousel({ images, title, onImageClick }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setIndex(0);
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
    // nothing — could add dragging visuals
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    const threshold = 40; // px
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
  }

  // Touch fallback for older devices
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const threshold = 40;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
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
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full overflow-hidden bg-black/30">
        <div
          className="flex w-full transition-transform duration-300"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="flex w-full shrink-0 items-center justify-center overflow-hidden bg-zinc-950">
              <img
                src={src}
                alt={title ?? `image-${i + 1}`}
                className="block max-h-[62vh] w-full cursor-pointer object-contain"
                onClick={() => onImageClick?.(i)}
                draggable={false}
                style={{
                  objectPosition: "center center",
                  transform: "none",
                  filter: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

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
