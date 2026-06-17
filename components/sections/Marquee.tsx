import { Star } from "lucide-react";

const WORDS = [
  "Reliable",
  "Fully Insured",
  "Professional",
  "Technology-Powered",
  "Sydney-Wide",
  "Quality Guaranteed",
  "Fast Response",
  "Transparent Pricing",
];

/** Infinite scrolling trust-word ticker. Freezes (static) under reduced motion
 *  via the global prefers-reduced-motion rule. */
export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink py-5">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] items-center gap-8 pr-8">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] text-white/70"
          >
            {w}
            <Star className="h-3 w-3 shrink-0 fill-current text-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
