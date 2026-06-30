"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useLenis } from "@/components/providers/SmoothScroll";
import { scenes } from "@/data/experience";
import { ease } from "@/lib/motion";

const flyEase = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * SECTION 1 — the house. A full-screen luxury hero that reacts to the mouse
 * with restrained parallax and carries interactive hotspots. Hovering a
 * hotspot glows, labels the room and subtly zooms the scene; clicking flies
 * the page down into that service's scene.
 */
export function HeroHouse() {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const root = useRef<HTMLElement>(null);

  // Mouse parallax + a shared "zoom on hotspot hover" value.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const zoom = useMotionValue(1);
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.4 });
  const sZoom = useSpring(zoom, { stiffness: 140, damping: 24, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = root.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 26);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 26);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const flyTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.7, easing: flyEase });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const transformStyle = reduced ? undefined : { x: sx, y: sy, scale: sZoom };

  return (
    <section
      id="house"
      ref={root}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate flex min-h-[100svh] items-start overflow-hidden bg-ink text-white"
    >
      {/* Backdrop image — parallax/zoom layer (decorative, no pointer events). */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={transformStyle}
      >
        <motion.div
          className="absolute -inset-[6%]"
          initial={reduced ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease, delay: 0.3 }}
        >
          <Image
            src="/luxuryhouseatdark.webp"
            alt="A luxury Vyntra-maintained property at dusk"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover [filter:saturate(1.05)_contrast(1.04)_brightness(0.97)]"
          />
        </motion.div>
      </motion.div>

      {/* Warm cinematic grade + soft vignette + legibility gradients. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-900/15 mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_115%_at_50%_45%,transparent_44%,rgba(8,11,20,0.6)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/25 to-ink" />

      {/* Hotspots — share the parallax/zoom transform so they stay anchored. */}
      <motion.div className="absolute inset-0 z-10" style={transformStyle}>
        {scenes.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => flyTo(s.id)}
            onMouseEnter={() => !reduced && zoom.set(1.045)}
            onMouseLeave={() => !reduced && zoom.set(1)}
            onFocus={() => !reduced && zoom.set(1.045)}
            onBlur={() => !reduced && zoom.set(1)}
            aria-label={`Explore ${s.label}`}
            style={{ left: `${s.hotspot.x}%`, top: `${s.hotspot.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
          >
            {/* Label */}
            <span className="pointer-events-none absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-gold/30 bg-ink/85 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              {s.label}
            </span>
            {/* Marker */}
            <span className="relative grid h-7 w-7 place-items-center">
              <span className="hotspot-ring absolute h-7 w-7 rounded-full border border-gold/60" />
              <span className="relative h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_rgba(212,175,55,0.8)] ring-2 ring-white/40 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_26px_rgba(212,175,55,1)] group-focus-visible:scale-125" />
            </span>
          </button>
        ))}
      </motion.div>

      {/* Quiet intro copy + interaction hint (kept clear of the hotspots). */}
      <Container className="pointer-events-none relative z-20 pt-28">
        <motion.div
          className="max-w-lg"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.4 }}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
            Sydney-wide property services
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Step inside the
            <br />
            <span className="text-gold">Vyntra</span> standard
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            Explore the property — hover a glowing point to discover the service
            behind every detail.
          </p>
        </motion.div>
      </Container>

      {/* Scroll cue — flies into the first scene. */}
      <button
        type="button"
        onClick={() => flyTo(scenes[0].id)}
        aria-label="Begin exploring"
        className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
          Explore
        </span>
        <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
      </button>
    </section>
  );
}
