import { FeedCard } from "@/components/feed/FeedCard";

const stories = [
  { name: "Your story", accent: "linear-gradient(135deg, #f43f5e, #fb923c)", avatar: "Y" },
  { name: "Ava", accent: "linear-gradient(135deg, #ec4899, #a855f7)", avatar: "A" },
  { name: "Luca", accent: "linear-gradient(135deg, #22c55e, #14b8a6)", avatar: "L" },
  { name: "Hana", accent: "linear-gradient(135deg, #38bdf8, #6366f1)", avatar: "H" },
  { name: "Noah", accent: "linear-gradient(135deg, #fbbf24, #f97316)", avatar: "N" },
];

const posts = [
  {
    id: 1,
    user: "foodiegram",
    handle: "@foodiegram",
    location: "Lisbon, PT",
    title: "Milanesa ibérica",
    images: [
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    ],
    imageDescriptions: [
      "Fresh Mediterranean bowl with avocado and greens.",
      "Golden hour light over a colorful dinner plate.",
      "A simple, vibrant plate ready to be shared.",
    ],
    caption: "Golden hour dinner vibes with a fresh Mediterranean bowl.",
    likes: 1420,
    comments: 86,
    time: "2h",
    cuisine: "Mediterranean",
    rating: 9.0,
    pricePerPerson: "25€/person",
  },
  {
    id: 2,
    user: "city.cuisine",
    handle: "@city.cuisine",
    location: "Paris, FR",
    title: "Argentinian Milanesa",
    images: [
      "https://res.cloudinary.com/dg7kyimer/image/upload/v1773413265/nhnp3c8kbbbxghc6hkhd.jpg",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    ],
    imageDescriptions: [
      "Crispy milanesa on a rustic wooden table.",
      "A fresh side of greens and crunchy toppings.",
      "Warm plate, bright flavors, and a perfect bite.",
      "Late-night comfort food and good energy.",
      "A close-up of the golden crust and texture.",
      "The final shot before the table is cleared.",
    ],
    caption: "Street food, late-night energy, and zero regrets.",
    likes: 2860,
    comments: 140,
    time: "5h",
    cuisine: "Argentinian",
    rating: 7.1,
    pricePerPerson: "18€/person",
  },
  {
    id: 3,
    user: "traveltable",
    handle: "@traveltable",
    location: "Rome, IT",
    title: "Sunset pasta",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80",
    ],
    imageDescriptions: [
      "Fresh pasta with a sunset glow and olive oil.",
      "A cozy, simple plate made for sharing.",
    ],
    caption: "Sunset pasta, a little chaos, and lots of flavor.",
    likes: 3180,
    comments: 212,
    time: "1d",
    cuisine: "Italian",
    rating: 8.3,
    pricePerPerson: "30€/person",
  },
];

export default function FeedPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-5">
        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
