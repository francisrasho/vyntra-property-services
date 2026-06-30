"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { ease } from "@/lib/motion";

/**
 * Dark cinematic intro. Covers the screen on first load (once per session),
 * holds scroll at the top, reveals a quiet wordmark + a gold line drawing in,
 * then lifts to unveil the house. Skipped entirely under reduced motion.
 */
export function CinematicLoader() {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [show, setShow] = useState(false);

  // Decide on the client so SSR renders nothing (no hydration mismatch).
  useEffect(() => {
    if (reduced) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("vps-intro") === "1";
    } catch {
      /* storage unavailable — just play it */
    }
    if (seen) return;
    setShow(true);
    try {
      sessionStorage.setItem("vps-intro", "1");
    } catch {
      /* ignore */
    }
  }, [reduced]);

  // Hold the page at the top and pause smooth scroll while the intro plays.
  useEffect(() => {
    if (!show) return;
    window.scrollTo(0, 0);
    lenis?.stop();
    const t = window.setTimeout(() => setShow(false), 2000);
    return () => {
      window.clearTimeout(t);
      lenis?.start();
    };
  }, [show, lenis]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          aria-hidden
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <span className="text-3xl font-bold tracking-[0.18em] text-white sm:text-4xl">
              VYNTRA<span className="text-gold">.</span>
            </span>
            <span className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-gold-soft">
              Property Services
            </span>
            <span className="mt-7 block h-px w-44 overflow-hidden bg-white/15">
              <motion.span
                className="block h-full origin-left bg-gradient-to-r from-gold-soft to-gold"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease, delay: 0.2 }}
              />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
