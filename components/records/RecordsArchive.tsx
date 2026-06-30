"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { MonoReadout, VerifiedBadge } from "@/components/ui/os";
import { BeforeAfter } from "@/components/record/BeforeAfter";
import { records } from "@/data/records";
import { signalTelemetry } from "@/data/signal";
import type { Segment } from "@/data/types";

const fmtDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

const filters: { key: Segment | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "strata", label: "Strata" },
  { key: "commercial", label: "Commercial" },
  { key: "residential", label: "Residential" },
];

export function RecordsArchive() {
  const [segment, setSegment] = useState<Segment | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const shown = records.filter(
    (r) => segment === "all" || r.segment === segment,
  );

  return (
    <section className="bg-travertine py-20">
      <Container>
        {/* Ledger header — aggregate + filters */}
        <div className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <MonoReadout className="text-ink-400">
            {signalTelemetry.recordsTotal.toLocaleString()} records ·{" "}
            {signalTelemetry.verifiedPct}% verified · {signalTelemetry.since}–
            {new Date().getFullYear()}
          </MonoReadout>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter records by segment"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setSegment(f.key)}
                aria-pressed={segment === f.key}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  segment === f.key
                    ? "border-graphite bg-graphite text-ondark"
                    : "border-line text-ink-600 hover:border-graphite/40 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* The ledger */}
        <ul className="mt-2">
          {shown.map((r) => {
            const isOpen = open === r.id;
            return (
              <li key={r.id} id={r.id} className="scroll-mt-28 border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 py-4 text-left text-xs transition-colors hover:bg-paper sm:gap-5"
                >
                  <MonoReadout className="tabular w-24 shrink-0 text-ink-400">
                    {fmtDate(r.date)}
                  </MonoReadout>
                  <MonoReadout className="w-16 shrink-0 text-brass">
                    {r.id}
                  </MonoReadout>
                  <span className="hidden w-28 shrink-0 truncate font-sans text-ink sm:block">
                    {r.suburb}
                  </span>
                  <span className="flex-1 truncate font-sans text-ink-600">
                    {r.serviceName}
                  </span>
                  <VerifiedBadge />
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-ink-400 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>

                {isOpen && (
                  <div className="grid gap-6 pb-8 pt-2 sm:grid-cols-[1.4fr_1fr]">
                    <BeforeAfter
                      beforeSrc={r.beforeImage}
                      afterSrc={r.afterImage}
                      alt={`${r.serviceName}, ${r.suburb}`}
                    />
                    <div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        <MonoReadout className="text-ink-400">
                          {r.suburb}
                        </MonoReadout>
                        <MonoReadout className="text-ink-400">
                          {r.segment}
                        </MonoReadout>
                      </div>
                      <p className="mt-3 leading-relaxed text-ink-600">
                        {r.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <VerifiedBadge />
                        <span className="text-sm text-ink-400">
                          · Filed to property history
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-8">
          <MonoReadout className="text-ink-400">
            Showing {shown.length} of {records.length} published records ·
            archive grows with every completed job
          </MonoReadout>
        </p>
      </Container>
    </section>
  );
}
