import type { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
  id: string;
  accent?: "pink" | "green";
} & InputHTMLAttributes<HTMLInputElement>;

const accentClasses = {
  pink: "focus:border-pink-400 focus:ring-pink-400/30",
  green: "focus:border-[#01bf62] focus:ring-[#01bf62]/30",
};

export function Input({ label, id, accent = "pink", className = "", ...props }: InputProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm text-zinc-200">
      <span>{label}</span>
      <input
        id={id}
        className={[
          "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-zinc-400 transition focus:ring-2",
          accentClasses[accent],
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
