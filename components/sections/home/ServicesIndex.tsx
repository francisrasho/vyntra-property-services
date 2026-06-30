"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MonoReadout } from "@/components/ui/os";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { cn } from "@/lib/cn";
import { services } from "@/data/services";
import type { Segment } from "@/data/types";

/** Which buyer segments each service serves (drives the filter + tags). */
const serviceSegments: Record<string, Segment[]> = {
  "commercial-cleaning": ["commercial"],
  "office-cleaning": ["commercial"],
  "strata-cleaning": ["strata"],
  "end-of-lease-cleaning": ["residential"],
  "property-maintenance": ["strata", "commercial"],
  "handyman-services": ["residential", "commercial"],
  "pressure-washing": ["strata", "commercial"],
  "garden-maintenance": ["strata", "residential"],
  "emergency-property-support": ["strata", "commercial"],
};

const filters: { key: Segment | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "strata", label: "Strata" },
  { key: "commercial", label: "Commercial" },
  { key: "residential", label: "Residential" },
];

export function ServicesIndex() {
  const [active, setActive] = useState<Segment | "all">("all");

  const shown = services.filter(
    (s) => active === "all" || serviceSegments[s.slug]?.includes(active),
  );

  return (
    <section id="services" className="bg-travertine py-24">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="What we do"
            title="One accountable partner for every property need."
            subtitle="Cleaning, maintenance and property care across Sydney — each job documented and verified to the same standard."
          />

          {/* Segment filter */}
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter services by segment"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                aria-pressed={active === f.key}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  active === f.key
                    ? "border-graphite bg-graphite text-ondark"
                    : "border-line text-ink-600 hover:border-graphite/40 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The index — a clean typographic list, not a card grid */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {shown.map((s) => (
            <li key={s.slug} className="bg-paper">
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full items-start gap-4 p-6 transition-colors hover:bg-travertine sm:p-7"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {s.tagline}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {serviceSegments[s.slug]?.map((seg) => (
                      <MonoReadout key={seg} className="text-ink-400">
                        {seg}
                      </MonoReadout>
                    ))}
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brass" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <QuoteButton size="lg">Open a property</QuoteButton>
          <p className="text-sm text-ink-600">
            Not sure which service you need? We&apos;ll scope it with you.
          </p>
        </div>
      </Container>
    </section>
  );
}
