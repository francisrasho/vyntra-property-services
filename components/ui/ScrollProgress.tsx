"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold bar at the very top that tracks scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-gold via-gold-soft to-gold"
    />
  );
}
