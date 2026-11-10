"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPost } from "@/hooks/useMapPosts";

type Spot = { key: string; lat: number; lng: number; posts: MapPost[] };

// Posts at the same restaurant share one pin (coordinates rounded to ~1m).
function groupBySpot(posts: MapPost[]): Spot[] {
  const spots = new Map<string, Spot>();
  for (const post of posts) {
    const key = `${post.latitude.toFixed(5)},${post.longitude.toFixed(5)}`;
    const spot = spots.get(key);
    if (spot) spot.posts.push(post);
    else spots.set(key, { key, lat: post.latitude, lng: post.longitude, posts: [post] });
  }
  return Array.from(spots.values());
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function pinIcon(spot: Spot) {
  const root = el("div", "mealit-pin");
  const cover = spot.posts.find((p) => p.image)?.image;
  if (cover) {
    const img = el("img");
    img.src = cover;
    img.alt = "";
    img.loading = "lazy";
    root.appendChild(img);
  } else {
    root.appendChild(el("i", "fa-solid fa-utensils"));
  }
  if (spot.posts.length > 1) root.appendChild(el("span", "mealit-pin-count", String(spot.posts.length)));

  return L.divIcon({ html: root, className: "", iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -46] });
}

// Built with DOM nodes (not HTML strings) so post text can't inject markup.
function popupContent(spot: Spot, openPost: (id: string) => void) {
  const root = el("div", "mealit-popup");
  const first = spot.posts[0];
  const placeLabel = [first.placeName, first.city].filter(Boolean).join(" · ");
  if (placeLabel) root.appendChild(el("p", "mealit-popup-place", placeLabel));

  const list = el("div", "mealit-popup-list");
  for (const post of spot.posts) {
    const item = el("button", "mealit-popup-item");
    item.type = "button";
    item.addEventListener("click", () => openPost(post.id));

    if (post.image) {
      const img = el("img");
      img.src = post.image;
      img.alt = post.title ?? "";
      img.loading = "lazy";
      item.appendChild(img);
    }

    const body = el("div");
    body.appendChild(el("p", "mealit-popup-title", post.title || "Untitled dish"));
    const meta = [post.cuisine, post.rating != null && !Number.isNaN(post.rating) ? `★ ${post.rating}` : null]
      .filter(Boolean)
      .join(" · ");
    if (meta) body.appendChild(el("p", "mealit-popup-meta", meta));
    item.appendChild(body);
    list.appendChild(item);
  }
  root.appendChild(list);
  return root;
}

export default function PostsMap({ posts }: { posts: MapPost[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const router = useRouter();

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
      zoomControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    // Esri's dark gray basemap needs no API key. The "Reference" layer adds city/street labels on top.
    const esri = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
    L.tileLayer(`${esri}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
      attribution: 'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
      maxZoom: 16,
    }).addTo(map);
    L.tileLayer(`${esri}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 16 }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redraw pins whenever posts change.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const spots = groupBySpot(posts);
    for (const spot of spots) {
      L.marker([spot.lat, spot.lng], { icon: pinIcon(spot) })
        .bindPopup(() => popupContent(spot, (id) => router.push(`/post/${id}`)), {
          className: "mealit-popup-wrapper",
          maxWidth: 260,
          minWidth: 220,
        })
        .addTo(layer);
    }

    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    }
  }, [posts, router]);

  return <div ref={containerRef} className="h-full w-full" />;
}
