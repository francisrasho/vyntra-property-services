import type { Variants } from "framer-motion";

/** Premium easing curve (easeOutExpo-ish) used across the site. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
};

/** Per-word headline reveal (blur-focus + rise). */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

/** Parent container that staggers its direct children's reveal. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/** Shared viewport config: animate once, slightly before fully in view. */
export const viewport = { once: true, margin: "-80px" } as const;
