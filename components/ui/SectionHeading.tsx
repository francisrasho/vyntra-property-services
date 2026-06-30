import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./os";

/**
 * Section heading in the Property voice (serif title) with a mono eyebrow and
 * a sans subtitle. `tone`/`invert` adapt it to light or graphite surfaces.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone,
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "ondark";
  invert?: boolean;
  className?: string;
}) {
  const onDark = tone === "ondark" || invert;
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={onDark ? "ondark" : "ink"}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-serif text-3xl font-medium leading-[1.08] tracking-tight text-balance sm:text-4xl",
          eyebrow && "mt-4",
          onDark ? "text-ondark" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            onDark ? "text-ondark-600" : "text-ink-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
