"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Keeps GSAP ScrollTrigger in lock-step with Lenis smooth scrolling: every
 * Lenis scroll tick drives a ScrollTrigger update so scrub-based animations
 * track the eased scroll position rather than the raw native one.
 *
 * Renders nothing. When Lenis is inactive (reduced motion), this is a no-op —
 * the homepage's GSAP animations are gated behind the same preference, so
 * there is nothing to keep in sync.
 */
export function ScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    // Positions can be off until first layout settles; recalc once wired up.
    ScrollTrigger.refresh();
    return () => {
      lenis.off("scroll", update);
    };
  }, [lenis]);

  return null;
}
