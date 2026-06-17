import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Vyntra VP mark + wordmark. */
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
      <Image
        src="/logo-mark.png"
        alt=""
        width={214}
        height={160}
        priority
        className="h-9 w-auto rounded-lg ring-1 ring-gold/20"
      />
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
