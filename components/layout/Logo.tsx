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
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink ring-1 ring-gold/20">
        <Image
          src="/logo-mark.svg"
          alt=""
          width={810}
          height={554}
          priority
          unoptimized
          className="h-5 w-auto"
        />
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
