"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import getFirebaseAuth from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { AuthLoadingOverlay, Spinner } from "@/components/auth/AuthLoadingOverlay";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "popup": Google window open; "finishing": signed in, waiting for the API before redirect
  const [googleStatus, setGoogleStatus] = useState<"idle" | "popup" | "finishing">("idle");

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    setGoogleStatus("popup");
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase not initialized");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      // Keep the loader up until the feed takes over (it unmounts this page).
      setGoogleStatus("finishing");
      router.replace("/feed");
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed");
      setGoogleStatus("idle");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase not initialized");
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/feed");
    } catch (err: any) {
      setError(err?.message ?? "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      {googleStatus === "finishing" && <AuthLoadingOverlay />}
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7fdc5a]">Sign in</p>
        <h1 className="text-4xl font-black tracking-tight">
          Welcome{" "}
          <span className="bg-gradient-to-r from-[#01bf62] via-[#7fdc5a] to-[#c0ff71] bg-clip-text text-transparent">
            back.
          </span>
        </h1>
        <p className="text-zinc-400">Pick up where you left off and see where everyone is eating.</p>
      </div>

      <Button
        variant="secondary"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full gap-2 border-white/15 py-3.5 text-base disabled:opacity-60"
      >
        {googleStatus === "idle" ? <FontAwesomeIcon icon={faGoogle} className="text-lg" /> : <Spinner />}
        <span>{googleStatus === "idle" ? "Continue with Google" : "Connecting to Google…"}</span>
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <div className="h-px flex-1 bg-white/10" />
        Or with email
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input id="email" label="Email" type="email" autoComplete="email" accent="green" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Password" type="password" autoComplete="current-password" accent="green" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#01bf62] px-7 py-3.5 font-semibold text-zinc-950 shadow-lg shadow-[#01bf62]/25 transition hover:bg-[#7fdc5a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && googleStatus === "idle" ? "Signing in…" : "Sign in"}
          {!loading && <i className="fa-solid fa-arrow-right text-sm" aria-hidden />}
        </button>
      </form>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 pt-5 text-sm text-zinc-400">
        <span>
          New to MealIT?{" "}
          <Link href="/signup" className="font-semibold text-[#7fdc5a] transition hover:text-[#c0ff71]">
            Join free
          </Link>
        </span>
        <Link href="/" className="transition hover:text-white">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
