"use client";

import { Container } from "@/components/ui/Container";
import { QuoteButton } from "@/components/forms/QuoteButton";

const SERVICES = [
  "Commercial Cleaning",
  "Office Cleaning",
  "Strata Cleaning",
  "End of Lease Cleaning",
  "Property Maintenance",
  "Handyman Services",
  "Pressure Washing",
  "Garden Maintenance",
  "Emergency Support",
];

/**
 * Lightweight hero shown instead of the 3D building on small screens or when the
 * user prefers reduced motion. Keeps the same message without the WebGL cost.
 */
export function StaticHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#7aa2ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_60%)]" />

      <Container>
        <div className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
              Sydney-wide property services
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white text-3d-gold sm:text-5xl lg:text-6xl">
              Sydney&apos;s Premium{" "}
              <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent text-3d-gold-soft">
                Property Services
              </span>{" "}
              Partner
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/60">
              One trusted team for cleaning, maintenance and care across every property in your
              portfolio.
            </p>
            <div className="mt-8">
              <QuoteButton size="lg">Get Free Quote</QuoteButton>
            </div>
          </div>

          {/* Stacked "floors" — pure CSS skyline */}
          <ul className="mx-auto flex w-full max-w-sm flex-col gap-1.5">
            {SERVICES.map((name, i) => (
              <li
                key={name}
                className="group flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] px-4 py-3 backdrop-blur-sm transition-colors hover:border-gold/40"
                style={{ width: `${100 - i * 4}%` }}
              >
                <span className="text-sm font-medium text-white/80 group-hover:text-white">
                  {name}
                </span>
                <span className="h-2 w-2 rounded-full bg-gold/60 shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
