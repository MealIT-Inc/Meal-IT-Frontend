import { Button } from "@/components/ui/Button";

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">New post</p>
        <h1 className="mt-2 text-3xl font-bold">Create</h1>
      </div>

      <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6">
        <div className="mb-4 flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-4xl text-zinc-500">
          ＋
        </div>

        <textarea
          placeholder="Write a caption for your post..."
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-900/80 p-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-pink-500"
        />

        <div className="mt-4 flex justify-end">
          <Button className="rounded-2xl px-5 py-2.5">Share post</Button>
        </div>
      </div>
    </div>
  );
}
