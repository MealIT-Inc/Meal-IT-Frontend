"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import getFirebaseAuth from "@/lib/firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      if (!auth) throw new Error("Firebase not initialized");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      router.replace("/feed");
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed");
    } finally {
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
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (result.user && fullName.trim()) {
        const { updateProfile } = await import("firebase/auth");
        await updateProfile(result.user, { displayName: fullName.trim() });
      }

      router.replace("/feed");
    } catch (err: any) {
      setError(err?.message ?? "Account creation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <img src="/MealitLogo.svg" alt="MealIT logo" className="mx-auto h-12 w-12 rounded-2xl object-contain" />
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-zinc-400">Join the community with email or Google.</p>
      </div>

      <Button variant="secondary" onClick={handleGoogle} disabled={loading} className="w-full justify-center gap-2 rounded-2xl py-3">
        <FontAwesomeIcon icon={faGoogle} className="text-xl" />
        <span>Continue with Google</span>
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <div className="h-px flex-1 bg-white/10" />
        Or
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input id="fullName" label="Full name" type="text" placeholder="Alex Morgan" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input id="email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Password" type="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full rounded-2xl py-3" disabled={loading}>
          Create account
        </Button>
      </form>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-pink-400 transition hover:text-pink-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
