import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-lg font-black text-zinc-950">
          M
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-zinc-400">Join the community with email or Google.</p>
      </div>

      <Button variant="secondary" className="w-full justify-center gap-2 rounded-2xl py-3">
        <span>G</span>
        Sign up with Google
      </Button>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <div className="h-px flex-1 bg-white/10" />
        Or
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form className="space-y-4">
        <Input id="fullName" label="Full name" type="text" placeholder="Alex Morgan" />
        <Input id="email" label="Email" type="email" placeholder="you@example.com" />
        <Input id="password" label="Password" type="password" placeholder="Create a strong password" />
        <Button type="submit" className="w-full rounded-2xl py-3">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/login" className="text-pink-400 transition hover:text-pink-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
