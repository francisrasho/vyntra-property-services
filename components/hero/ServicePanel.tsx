"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { getZoneContent, type HeroZone } from "./panorama-data";

/**
 * Premium glass information panel shown when a service zone is opened — used by
 * both the 360° viewer and the reduced-motion / low-power fallback selector.
 */
export function ServicePanel({
  zone,
  onClose,
}: {
  zone: HeroZone;
  onClose: () => void;
}) {
  const c = getZoneContent(zone);

  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label={`${c.title} details`}
      className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[22px] border border-white/[0.12] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.accent }} />
          {c.zone}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <h2 className="mt-4 text-[1.65rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2rem]">
        {c.title}
      </h2>
      {c.tagline && (
        <p className="mt-2 text-[0.95rem] font-medium text-gold-soft">{c.tagline}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-white/65">{c.description}</p>

      {c.benefits.length > 0 && (
        <ul className="mt-5 grid gap-2.5">
          {c.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-white/75">
              <span
                className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: `${c.accent}26`, color: c.accent }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Magnetic>
          <QuoteButton size="md">
            Get a Free Quote <ArrowRight className="h-4 w-4" />
          </QuoteButton>
        </Magnetic>
        <Button
          href={c.href}
          variant="outline"
          size="md"
          className="border-white/20 bg-white/5 text-white hover:border-gold hover:text-gold"
        >
          View Service
        </Button>
      </div>
    </motion.div>
  );
}
