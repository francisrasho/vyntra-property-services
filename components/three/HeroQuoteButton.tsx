"use client";

import { ArrowRight } from "lucide-react";
import { useQuoteModal } from "@/components/forms/QuoteModalProvider";

/**
 * Premium "3D" CTA used inside the hero overlay. Built with stacked box-shadows
 * for an extruded gold face that physically presses down when clicked.
 */
export function HeroQuoteButton() {
  const { open } = useQuoteModal();

  return (
    <button
      onClick={open}
      className="pointer-events-auto group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-gold-soft to-gold px-7 py-3.5 text-base font-semibold text-ink transition-[transform,box-shadow] duration-150 will-change-transform hover:-translate-y-0.5 active:translate-y-[5px] [box-shadow:0_5px_0_#9c7d18,0_7px_0_#6b540d,0_14px_24px_rgba(0,0,0,0.45)] hover:[box-shadow:0_7px_0_#9c7d18,0_9px_0_#6b540d,0_18px_30px_rgba(0,0,0,0.5)] active:[box-shadow:0_1px_0_#9c7d18,0_2px_0_#6b540d,0_5px_12px_rgba(0,0,0,0.4)]"
    >
      {/* sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />
      <span className="relative">Get a Free Quote</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}
