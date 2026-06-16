"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import type { GalleryItem } from "@/data/gallery";

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const open = index >= 0 && index < items.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(Math.min(index + 1, items.length - 1));
      if (e.key === "ArrowLeft") onNavigate(Math.max(index - 1, 0));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, index, items.length, onClose, onNavigate]);

  if (!mounted) return null;
  const item = open ? items[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(Math.max(index - 1, 0))}
            disabled={index === 0}
            aria-label="Previous"
            className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30 sm:left-5"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(Math.min(index + 1, items.length - 1))}
            disabled={index === items.length - 1}
            aria-label="Next"
            className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30 sm:right-5"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <motion.div
            className="w-full max-w-4xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {item.before && item.after ? (
              <BeforeAfterSlider
                before={item.before}
                after={item.after}
                alt={item.title}
              />
            ) : (
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            )}
            <p className="mt-4 text-center text-sm text-white/80">
              {item.title} · {item.category}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
