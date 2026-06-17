"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Wraps each page so route changes animate in (template re-mounts per route). */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}
