"use client";

import { MessageSquareQuote, PhoneCall } from "lucide-react";
import { company } from "@/data/company";
import { useQuoteModal } from "@/components/forms/QuoteModalProvider";

/** Sticky bottom call/quote bar shown only on mobile. */
export function MobileCallBar() {
  const { open } = useQuoteModal();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-surface/95 p-3 backdrop-blur-md md:hidden">
      <a
        href={`tel:${company.phone}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-3 text-sm font-semibold text-ink"
      >
        <PhoneCall className="h-4 w-4 text-gold-dark" /> Call
      </a>
      <button
        type="button"
        onClick={open}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink"
      >
        <MessageSquareQuote className="h-4 w-4" /> Free Quote
      </button>
    </div>
  );
}
