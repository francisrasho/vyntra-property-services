import Image from "next/image";
import { cn } from "@/lib/cn";
import { MonoReadout } from "./os";

const ratios: Record<string, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  hero: "aspect-[3/2]",
};

/**
 * Photography slot. Renders a real asset when `src` is provided; otherwise a
 * branded graphite placeholder labelled with the awaited shot — so the site is
 * never broken and never falls back to stock. Awaiting the directed shoot.
 */
export function Photo({
  src,
  alt,
  ratio = "landscape",
  label = "Photography",
  tone = "dark",
  priority,
  sizes,
  className,
}: {
  src?: string;
  alt: string;
  ratio?: keyof typeof ratios;
  label?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        ratios[ratio],
        tone === "dark" ? "bg-graphite" : "bg-paper",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 grid place-items-center",
            tone === "dark"
              ? "bg-[radial-gradient(circle_at_30%_20%,rgba(198,162,104,0.12),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_30%_20%,rgba(198,162,104,0.16),transparent_60%)]",
          )}
        >
          <MonoReadout
            className={tone === "dark" ? "text-ondark-400" : "text-ink-400"}
          >
            {label}
          </MonoReadout>
        </div>
      )}
    </div>
  );
}
