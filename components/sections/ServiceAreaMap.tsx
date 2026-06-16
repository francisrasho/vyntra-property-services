"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { serviceAreas } from "@/data/serviceAreas";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function ServiceAreaMap({ showHeading = true }: { showHeading?: boolean }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="service-areas" className="py-24">
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow="Where we work"
            title="Servicing all of Greater Sydney"
            subtitle="From the CBD to the Shire, the Hills to the Northern Beaches — fast, reliable coverage across the metro area."
          />
        )}

        <div className={cn("grid gap-8 lg:grid-cols-[1.5fr_1fr]", showHeading && "mt-12")}>
          {/* Stylised interactive map */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink ring-1 ring-white/5">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#13203a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <rect width="100" height="75" fill="url(#landGrad)" />
              {/* faint grid */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v${i}`} x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="75" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.3" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.3" />
              ))}
              {/* stylised coastline (east) with ocean tint */}
              <path
                d="M84 0 C 80 14, 90 26, 82 40 C 76 54, 88 66, 84 75 L100 75 L100 0 Z"
                fill="#0b1220"
                stroke="var(--color-gold)"
                strokeOpacity="0.25"
                strokeWidth="0.4"
              />
            </svg>

            {serviceAreas.map((a) => (
              <button
                key={a.id}
                type="button"
                onMouseEnter={() => setActive(a.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(a.id)}
                onBlur={() => setActive(null)}
                style={{ left: `${a.x}%`, top: `${a.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                aria-label={`${a.name} — response ${a.responseTime}`}
              >
                {!reduced && (
                  <span
                    className={cn(
                      "absolute -inset-1.5 rounded-full motion-safe:animate-ping",
                      a.availability === "high-demand" ? "bg-gold/30" : "bg-gold/40",
                    )}
                  />
                )}
                <span className="relative block h-3 w-3 rounded-full bg-gold ring-2 ring-ink transition-transform hover:scale-125" />
                {active === a.id && (
                  <span className="absolute bottom-full left-1/2 z-10 mb-2 w-44 -translate-x-1/2 rounded-lg bg-white p-2.5 text-left shadow-xl">
                    <span className="block text-xs font-bold text-ink">{a.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-600">
                      Response: {a.responseTime}
                    </span>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        a.availability === "high-demand"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700",
                      )}
                    >
                      {a.availability === "high-demand" ? "High demand" : "Available now"}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Region list */}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {serviceAreas.map((a) => (
              <li
                key={a.id}
                onMouseEnter={() => setActive(a.id)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
                  active === a.id
                    ? "border-gold/40 bg-gold/5"
                    : "border-ink/[0.08] bg-surface",
                )}
              >
                <span className="text-sm font-medium text-ink">{a.name}</span>
                <span className="text-xs font-semibold text-gold-dark">
                  {a.responseTime}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
