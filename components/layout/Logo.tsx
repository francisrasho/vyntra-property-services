import Link from "next/link";
import { cn } from "@/lib/cn";

/** Vyntra wordmark + geometric "V" mark. */
export function Logo({
  invert = false,
  className,
}: {
  invert?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Vyntra Property Services — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink shadow-[var(--shadow-glass)] ring-1 ring-gold/30">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            d="M4 5 L12 19 L20 5"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          invert ? "text-white" : "text-ink",
        )}
      >
        VYNTRA<span className="text-gold">.</span>
      </span>
    </Link>
  );
}
