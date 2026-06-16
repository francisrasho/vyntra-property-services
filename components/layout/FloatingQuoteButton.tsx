"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/cn";
import { useQuoteModal } from "@/components/forms/QuoteModalProvider";

/** Persistent desktop "Get a Free Quote" button that fades in after scroll. */
export function FloatingQuoteButton() {
  const { open } = useQuoteModal();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={open}
      className={cn(
        "fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] transition-all duration-300 hover:bg-gold-soft md:flex",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <MessageSquareQuote className="h-4 w-4" />
      Get a Free Quote
    </button>
  );
}
