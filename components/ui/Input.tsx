import type { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
  id: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <input
        id={id}
        className={[
          "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-zinc-400 transition focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
