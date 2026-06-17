"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";

/** Locks page scroll while `locked` is true. Pauses Lenis when smooth scroll is
 *  active; otherwise falls back to locking body overflow. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked, lenis]);
}
