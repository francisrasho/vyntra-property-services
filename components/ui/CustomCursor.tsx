"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** A trailing gold ring that follows the cursor and grows over interactive
 *  elements. Desktop (fine pointer) only; respects reduced motion. The native
 *  cursor stays visible for precision/accessibility. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const noReduce = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !noReduce) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const interactive = (e.target as HTMLElement)?.closest(
        "a, button, [role='button'], input, textarea, select, label",
      );
      setHovering(!!interactive);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden lg:block"
      style={{ x: ringX, y: ringY }}
    >
      <motion.div
        className="rounded-full border border-gold"
        animate={{
          width: hovering ? 52 : 26,
          height: hovering ? 52 : 26,
          x: hovering ? -26 : -13,
          y: hovering ? -26 : -13,
          backgroundColor: hovering
            ? "rgba(212,175,55,0.12)"
            : "rgba(212,175,55,0)",
          opacity: hovering ? 1 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
}
