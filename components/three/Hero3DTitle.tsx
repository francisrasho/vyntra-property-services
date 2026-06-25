"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const HEADING_CLASS =
  "text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.5rem]";

/**
 * Hero heading with a cursor-driven 3D parallax tilt and extruded gold lettering,
 * matching the way the building rotates with the cursor. Falls back to a flat
 * heading when the user prefers reduced motion.
 */
export function Hero3DTitle() {
  const reduced = useReducedMotion();

  const mx = useMotionValue(0); // -0.5..0.5 across viewport
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 120,
    damping: 18,
  });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, mx, my]);

  if (reduced) {
    return (
      <h1 className={`${HEADING_CLASS} text-3d-gold`}>
        Sydney&apos;s Premium{" "}
        <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent text-3d-gold-soft">
          Property Services
        </span>{" "}
        Partner
      </h1>
    );
  }

  return (
    <div style={{ perspective: 1100 }}>
      <motion.h1
        className={`${HEADING_CLASS} text-3d-gold will-change-transform`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <span style={{ display: "inline-block", transform: "translateZ(30px)" }}>
          Sydney&apos;s Premium{" "}
          <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent text-3d-gold-soft">
            Property Services
          </span>{" "}
          Partner
        </span>
      </motion.h1>
    </div>
  );
}
