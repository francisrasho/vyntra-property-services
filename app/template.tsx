"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Wraps each page so route changes fade in (template re-mounts per route).
 * NOTE: animate opacity only — a transform here would create a containing block
 * that breaks `position: sticky` on descendants (e.g. the scroll-driven 3D hero),
 * causing the sticky section to release early mid-scroll.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease }}
    >
      {children}
    </motion.div>
  );
}
