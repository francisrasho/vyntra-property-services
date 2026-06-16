"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneCall, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fullNav } from "./nav";
import { company } from "@/data/company";
import { Button } from "@/components/ui/Button";
import { useQuoteModal } from "@/components/forms/QuoteModalProvider";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { open: openQuote } = useQuoteModal();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight text-ink">
                VYNTRA<span className="text-gold">.</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-600 hover:bg-ink/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-0.5 overflow-y-auto">
              {fullNav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-ink/5"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-2.5 pt-6">
              <Button
                className="w-full"
                onClick={() => {
                  onClose();
                  openQuote();
                }}
              >
                Get a Free Quote
              </Button>
              <Button
                href={`tel:${company.phone}`}
                external
                variant="outline"
                className="w-full"
              >
                <PhoneCall className="h-4 w-4" /> {company.phoneDisplay}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
