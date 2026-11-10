import Image from "next/image";
import Link from "next/link";

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMAGES = {
  pizza: "photo-1565299624946-b28f40a0ae38",
  sushi: "photo-1579871494447-9811cf80d66c",
  poke: "photo-1546069901-ba9599a7e63c",
  ribs: "photo-1544025162-d76694265947",
  pancakes: "photo-1567620905732-2d1ec7ab7445",
  steak: "photo-1504674900247-0877df9cc836",
  salad: "photo-1540189549336-e6e99c3679fe",
  buddha: "photo-1512621776951-a57141f2eefd",
  sharing: "photo-1600891964599-f61ba0e24092",
  meatballs: "photo-1529042410759-befb1204b468",
  fineDining: "photo-1414235077428-338989a2e8c0",
  terrace: "photo-1559339352-11d035aa65de",
  chef: "photo-1600565193348-f74bd3c7ccdf",
};

const marquee = [
  { id: IMAGES.sushi, alt: "Salmon sushi rolls" },
  { id: IMAGES.pancakes, alt: "Stack of pancakes with syrup" },
  { id: IMAGES.steak, alt: "Sliced steak with greens" },
  { id: IMAGES.buddha, alt: "Colourful buddha bowl" },
  { id: IMAGES.ribs, alt: "Glazed barbecue ribs" },
  { id: IMAGES.salad, alt: "Fresh green salad" },
  { id: IMAGES.sharing, alt: "Shared plates on a table" },
  { id: IMAGES.meatballs, alt: "Meatballs on rocket" },
];

const features = [
  {
    icon: "fa-solid fa-camera",
    title: "Post every visit",
    text: "Upload photos of what you ordered, tag the restaurant and the day you went, and add a caption for each dish.",
  },
  {
    icon: "fa-solid fa-star-half-stroke",
    title: "Rate it out of 10",
    text: "A clear score, plus the cuisine and the price per person, so anyone can tell at a glance if it's worth it.",
  },
  {
    icon: "fa-solid fa-map-location-dot",
    title: "See it on the map",
    text: "Every post is pinned to its restaurant. Browse the world map to find where people are eating well near you.",
  },
  {
    icon: "fa-solid fa-compass",
    title: "Discover new spots",
    text: "Scroll a feed of real meals from people you follow and explore places you would never have found on your own.",
  },
];

const samplePosts = [
  {
    image: IMAGES.sushi,
    restaurant: "Koi Omakase",
    city: "Barcelona",
    cuisine: "Japanese",
    price: "45€",
    rating: 9.4,
    caption: "The salmon aburi melts. Sit at the bar if you can.",
  },
  {
    image: IMAGES.poke,
    restaurant: "Green Bowl Co.",
    city: "Madrid",
    cuisine: "Healthy",
    price: "14€",
    rating: 8.1,
    caption: "Huge portions and the teriyaki salmon is spot on.",
  },
  {
    image: IMAGES.ribs,
    restaurant: "Smoke & Oak",
    city: "Valencia",
    cuisine: "Barbecue",
    price: "28€",
    rating: 7.6,
    caption: "Ribs were great, sides were average. Go hungry.",
  },
];

// Same red → green scale the feed uses for the rating bubble.
function ratingGradient(rating: number) {
  const hue = ((Math.max(1, Math.min(10, rating)) - 1) / 9) * 120;
  return `linear-gradient(90deg, hsl(${hue} 90% 45%), hsl(${Math.min(150, hue + 20)} 85% 50%))`;
}

function RatingBadge({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-black text-zinc-950 ${className}`}
      style={{ background: ratingGradient(rating) }}
    >
      {rating.toFixed(1)}
    </span>
  );
}

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-zinc-950 text-white">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(ellipse_at_top,_rgba(1,191,98,0.22),_transparent_60%)]"
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon-192.png" alt="" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-black tracking-tight">MealIT</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#01bf62] px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-[#7fdc5a]"
          >
            Join free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-16">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#01bf62]/30 bg-[#01bf62]/10 px-3 py-1.5 text-sm text-[#c0ff71]">
            <i className="fa-solid fa-utensils text-xs" aria-hidden />
            The social network for restaurant lovers
          </span>

          <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl">
            Every great meal deserves to be{" "}
            <span className="bg-gradient-to-r from-[#01bf62] via-[#7fdc5a] to-[#c0ff71] bg-clip-text text-transparent">
              shared.
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-zinc-300">
            MealIT is where you keep track of the restaurants you visit. Post photos of
            your dishes, rate the place out of 10 and pin it on the map — then discover
            where your friends are eating.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#01bf62] px-7 py-3.5 font-semibold text-zinc-950 shadow-lg shadow-[#01bf62]/25 transition hover:bg-[#7fdc5a]"
            >
              Create your account
              <i className="fa-solid fa-arrow-right text-sm" aria-hidden />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-medium text-white transition hover:bg-white/10"
            >
              I already have an account
            </Link>
          </div>

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <div className="flex -space-x-2">
              {[IMAGES.salad, IMAGES.pancakes, IMAGES.steak].map((id) => (
                <Image
                  key={id}
                  src={unsplash(id, 80)}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                />
              ))}
            </div>
            Free to join with Google or email
          </div>
        </div>

        {/* Hero visual: a post as it appears in the feed */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-6 rounded-[48px] bg-[#01bf62]/20 blur-3xl" aria-hidden />

          <article className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-3 p-4">
              <Image
                src={unsplash(IMAGES.chef, 120)}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Trattoria da Luca</p>
                <p className="truncate text-xs text-zinc-400">
                  <i className="fa-solid fa-location-dot mr-1" aria-hidden />
                  Rome · @martina.eats
                </p>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src={unsplash(IMAGES.pizza, 900)}
                alt="Wood-fired pizza with chicken and red onion"
                fill
                sizes="(min-width: 1024px) 448px, 384px"
                fetchPriority="high"
                className="object-cover"
              />
            </div>
            <div className="space-y-3 p-4">
              <p className="text-sm text-zinc-300">
                <span className="font-semibold text-white">@martina.eats</span> Best crust
                I&apos;ve had outside Naples. Book ahead on weekends.
              </p>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-300">🍕 Italian</span>
                <RatingBadge rating={9.2} />
                <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-300">18€/person</span>
              </div>
            </div>
          </article>

          {/* Floating chips */}
          <div className="absolute -left-4 top-24 hidden items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm shadow-xl backdrop-blur sm:flex lg:-left-10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#01bf62]/15 text-[#01bf62]">
              <i className="fa-solid fa-map-pin" aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Pinned on the map</span>
              <span className="block text-xs text-zinc-400">Rome, Italy</span>
            </span>
          </div>
          <div className="absolute -right-4 bottom-28 hidden items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm shadow-xl backdrop-blur sm:flex lg:-right-8">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/15 text-pink-400">
              <i className="fa-solid fa-heart" aria-hidden />
            </span>
            <span className="font-semibold">128 likes</span>
          </div>
        </div>
      </section>

      {/* Photo marquee */}
      <section aria-label="Dishes shared on MealIT" className="relative border-y border-white/5 py-6">
        <div className="landing-marquee flex w-max gap-4">
          {[...marquee, ...marquee].map((item, i) => (
            <div
              key={i}
              className="relative h-36 w-52 shrink-0 overflow-hidden rounded-2xl sm:h-44 sm:w-64"
              aria-hidden={i >= marquee.length}
            >
              <Image
                src={unsplash(item.id, 520)}
                alt={i >= marquee.length ? "" : item.alt}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950 sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 sm:w-32" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7fdc5a]">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Your food diary, made social.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Stop forgetting the name of that place with the amazing dessert. Save it, score
            it and share it in under a minute.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#01bf62]/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#01bf62] to-[#c0ff71] text-lg text-zinc-950">
                  <i className={feature.icon} aria-hidden />
                </span>
                <span className="text-sm font-bold text-zinc-600">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample posts */}
      <section className="border-t border-white/5 bg-zinc-900/40 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7fdc5a]">
                Honest reviews
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Real plates. Real scores.
              </h2>
            </div>
            <p className="max-w-md text-zinc-400">
              Every post shows the cuisine, what you paid per person and a rating from 1 to
              10 — coloured from red to green so the good spots stand out.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {samplePosts.map((post) => (
              <article
                key={post.restaurant}
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={unsplash(post.image, 700)}
                    alt={`${post.cuisine} dish at ${post.restaurant}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <RatingBadge rating={post.rating} className="absolute right-3 top-3 shadow-lg" />
                </div>
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="font-bold">{post.restaurant}</h3>
                    <p className="text-sm text-zinc-400">
                      <i className="fa-solid fa-location-dot mr-1" aria-hidden />
                      {post.city}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-300">“{post.caption}”</p>
                  <div className="flex gap-2 text-xs text-zinc-300">
                    <span className="rounded-full bg-white/5 px-3 py-1">{post.cuisine}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{post.price}/person</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10">
          <Image
            src={unsplash(IMAGES.terrace, 1100)}
            alt="Restaurant terrace overlooking the sea at sunset"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent" />
          {[
            { top: "22%", left: "18%", img: IMAGES.sushi },
            { top: "38%", left: "62%", img: IMAGES.pizza },
            { top: "60%", left: "34%", img: IMAGES.poke },
          ].map((pin) => (
            <span
              key={pin.img}
              className="absolute flex h-12 w-12 -rotate-45 items-center justify-center overflow-hidden rounded-[50%_50%_50%_0] border-[3px] border-[#01bf62] bg-zinc-900 shadow-xl"
              style={{ top: pin.top, left: pin.left }}
              aria-hidden
            >
              <Image
                src={unsplash(pin.img, 100)}
                alt=""
                width={48}
                height={48}
                className="h-full w-full rotate-45 rounded-full object-cover"
              />
            </span>
          ))}
          <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/90 p-3 backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01bf62] text-zinc-950">
              <i className="fa-solid fa-map-location-dot" aria-hidden />
            </span>
            <div className="text-sm">
              <p className="font-semibold">3 posts nearby</p>
              <p className="text-zinc-400">Tap a pin to see the dishes</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7fdc5a]">World map</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Find where to eat, wherever you are.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Every review lands on a map with a photo pin. Travelling to a new city? Open the
            map and see the restaurants the community loved — with real photos, prices and
            scores.
          </p>
          <ul className="mt-8 space-y-3 text-zinc-300">
            {[
              "Pins show a photo of the dish",
              "Group several posts by the same restaurant",
              "Jump straight to the full review",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-[#01bf62]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[40px] border border-white/10">
          <Image
            src={unsplash(IMAGES.chef, 1600)}
            alt="Chef cooking over a flaming pan in a restaurant kitchen"
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />
          <div className="relative max-w-xl px-6 py-16 sm:px-12 sm:py-20">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Your next favourite restaurant is one post away.
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Join MealIT and start sharing the places worth going back to.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#01bf62] px-7 py-3.5 font-semibold text-zinc-950 transition hover:bg-[#7fdc5a]"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image src="/icon-192.png" alt="" width={24} height={24} className="rounded-lg" />
            <span className="font-semibold text-zinc-300">MealIT</span>
            <span>· The restaurants social media</span>
          </div>
          <p>© MealIT. Food photos from Unsplash.</p>
        </div>
      </footer>
    </main>
  );
}
