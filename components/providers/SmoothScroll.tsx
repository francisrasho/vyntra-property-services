"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

const LenisContext = createContext<Lenis | null>(null);

/** Access the active Lenis instance (null when smooth scroll is off, e.g.
 *  reduced motion). */
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(instance);

    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Smoothly honour hash links (in-page and on first load).
    const scrollToHash = () => {
      if (!window.location.hash) return;
      const el = document.querySelector(window.location.hash);
      if (el) instance.scrollTo(el as HTMLElement, { offset: -80 });
    };
    const onLoad = window.setTimeout(scrollToHash, 100);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(onLoad);
      window.removeEventListener("hashchange", scrollToHash);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
