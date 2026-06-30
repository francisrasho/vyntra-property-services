"use client";

import { ArrowRight } from "lucide-react";
import { HERO_ZONES, getZoneContent } from "./panorama-data";

/**
 * Clean, motion-free service selector shown when the 360° viewer can't or
 * shouldn't run (reduced-motion or no WebGL / low-power devices). Same zones,
 * same panels — selecting a zone opens the shared ServicePanel via `onSelect`.
 */
export function ServiceSelectorFallback({
  activeIndex,
  onSelect,
}: {
  activeIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="grid w-full gap-2.5 sm:grid-cols-2">
      {HERO_ZONES.map((zone, i) => {
        const c = getZoneContent(zone);
        const active = i === activeIndex;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            className={[
              "group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300",
              active
                ? "border-gold/50 bg-white/[0.07]"
                : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
            ].join(" ")}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: zone.accent }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                {zone.zone}
              </span>
              <span className="mt-0.5 block truncate text-[0.95rem] font-semibold text-white">
                {c.title}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold" />
          </button>
        );
      })}
    </div>
  );
}
