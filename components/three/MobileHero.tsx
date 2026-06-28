"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Hero3DTitle } from "./Hero3DTitle";
import { HeroQuoteButton } from "./HeroQuoteButton";

/** Bottom-to-top so "ground floor" sits at the base of the tower. */
const FLOORS = [
  { name: "Commercial Cleaning", slug: "commercial-cleaning" },
  { name: "Office Cleaning", slug: "office-cleaning" },
  { name: "Strata Cleaning", slug: "strata-cleaning" },
  { name: "End of Lease Cleaning", slug: "end-of-lease-cleaning" },
  { name: "Property Maintenance", slug: "property-maintenance" },
  { name: "Handyman Services", slug: "handyman-services" },
  { name: "Pressure Washing", slug: "pressure-washing" },
  { name: "Garden Maintenance", slug: "garden-maintenance" },
  { name: "Emergency Support", slug: "emergency-property-support" },
];

/**
 * Mobile hero — a pure-CSS 3D tower (no WebGL) so it stays smooth on phones.
 * Each floor is a tappable slab linking to its service page.
 */
export function MobileHero() {
  const total = FLOORS.length;

  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-64 rounded-full bg-[#7aa2ff]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_60%)]" />

      <Container>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
          Sydney-wide property services
        </span>

        <div className="mt-5">
          <Hero3DTitle />
        </div>

        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
          Every floor is a service we deliver with precision across Sydney. Tap a floor to explore it.
        </p>

        <div className="mt-7">
          <HeroQuoteButton />
        </div>

        {/* CSS 3D tower */}
        <div className="mt-14 flex justify-center [perspective:900px]">
          <div className="tower-sway [transform-style:preserve-3d]">
            {/* Spire */}
            <div className="mx-auto mb-2 flex flex-col items-center" style={{ transform: "translateZ(20px)" }}>
              <span className="h-3 w-3 rounded-full bg-[#ffe9a8] shadow-[0_0_16px_rgba(212,175,55,0.9)]" />
              <span className="h-5 w-[2px] bg-gradient-to-b from-gold to-transparent" />
            </div>

            <ul className="flex flex-col items-center gap-1.5">
              {[...FLOORS].reverse().map((floor, ri) => {
                const i = total - 1 - ri; // original bottom-up index
                // Taper the tower slightly toward the top.
                const width = 232 - i * 6;
                return (
                  <li key={floor.slug}>
                    <Link
                      href={`/services/${floor.slug}`}
                      className="floor-scan group relative flex items-center justify-between gap-3 rounded-md border border-white/10 bg-gradient-to-b from-[#17223c] to-[#0c1424] px-3 py-2.5 transition-colors active:border-gold"
                      style={{
                        width,
                        transform: "translateZ(30px)",
                        animationDelay: `${ri * 0.6}s`,
                      }}
                    >
                      {/* lit windows */}
                      <span className="flex shrink-0 items-center gap-[3px]">
                        {Array.from({ length: 5 }).map((_, w) => (
                          <span
                            key={w}
                            className={
                              (i + w) % 3 === 0
                                ? "h-3.5 w-2 rounded-[1px] bg-gold/80"
                                : (i + w) % 3 === 1
                                  ? "h-3.5 w-2 rounded-[1px] bg-gold-soft/60"
                                  : "h-3.5 w-2 rounded-[1px] bg-white/15"
                            }
                          />
                        ))}
                      </span>
                      <span className="truncate text-[13px] font-medium text-white/75 group-active:text-gold">
                        {floor.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Base + glow pool */}
            <div className="relative mx-auto mt-2" style={{ transform: "translateZ(30px)" }}>
              <div className="mx-auto h-2 w-60 rounded-full bg-gradient-to-b from-[#0b1424] to-transparent" />
              <div className="mx-auto mt-1 h-1 w-44 rounded-full bg-gold/40 blur-[3px]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
