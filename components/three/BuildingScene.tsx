"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Building3D } from "./Building3D";
import { StaticHero } from "./StaticHero";
import { Hero3DTitle } from "./Hero3DTitle";
import { HeroQuoteButton } from "./HeroQuoteButton";
import { Container } from "@/components/ui/Container";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

/** True when the device is small or the user prefers reduced motion. */
function useLiteMode() {
  const [lite, setLite] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () =>
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLite(check());
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setLite(check());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return lite;
}

const SERVICE_DETAILS = [
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    tagline: "Spotless commercial spaces, every single day.",
    description: "Presentation-perfect cleaning for retail, hospitality, medical and commercial premises.",
  },
  {
    slug: "office-cleaning",
    name: "Office Cleaning",
    tagline: "A workplace your team is proud to walk into.",
    description: "Discreet, detail-driven cleaning that keeps workspaces healthy and professional.",
  },
  {
    slug: "strata-cleaning",
    name: "Strata Cleaning",
    tagline: "Common areas that lift the whole building.",
    description: "Comprehensive strata cleaning that protects asset value and keeps residents happy.",
  },
  {
    slug: "end-of-lease-cleaning",
    name: "End of Lease Cleaning",
    tagline: "Bond-back clean, guaranteed standard.",
    description: "Thorough cleans that meet agent standards and protect the bond.",
  },
  {
    slug: "property-maintenance",
    name: "Property Maintenance",
    tagline: "One trusted partner for every property need.",
    description: "Planned and reactive maintenance that keeps your portfolio running smoothly.",
  },
  {
    slug: "handyman-services",
    name: "Handyman Services",
    tagline: "The jobs on your list — handled properly.",
    description: "Skilled, reliable handyman work for repairs and improvements.",
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    tagline: "Restore surfaces to like-new condition.",
    description: "High-pressure cleaning that strips grime from facades, car parks and paths.",
  },
  {
    slug: "garden-maintenance",
    name: "Garden Maintenance",
    tagline: "Grounds that always look cared for.",
    description: "Regular grounds upkeep that keeps exteriors sharp year-round.",
  },
  {
    slug: "emergency-property-support",
    name: "Emergency Support",
    tagline: "When something goes wrong, we move fast.",
    description: "Rapid-response support for urgent property issues — available when you need it.",
  },
];

export function BuildingScene() {
  const lite = useLiteMode();
  const lenis = useLenis();
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothly scroll the page so the given floor becomes the active one in the 3D.
  const focusFloor = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, 0.05 + (index + 0.5) * (0.95 / SERVICE_DETAILS.length));
      const targetY = window.scrollY + el.getBoundingClientRect().top + p * range;
      if (lenis) lenis.scrollTo(targetY, { duration: 1.1 });
      else window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    [lenis]
  );
  // Scroll + mouse feed the 3D through refs so scrolling never re-renders React.
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [activeFloor, setActiveFloor] = useState(-1);

  // Progress is computed from the container's true geometry (matches the sticky
  // pinned range exactly: 0 at the top, 1.0 right as it releases). framer's
  // useScroll mis-measures this range, so we drive everything ourselves.
  const progress = useMotionValue(0);

  useEffect(() => {
    if (lite !== false) return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) : 0;
      scrollRef.current = p;
      progress.set(p);
      const next =
        p < 0.05
          ? -1
          : Math.min(
              SERVICE_DETAILS.length - 1,
              Math.floor((p - 0.05) / (0.95 / SERVICE_DETAILS.length))
            );
      setActiveFloor((prev) => (prev === next ? prev : next));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lite, progress]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };
  }, []);

  const heroOpacity = useTransform(progress, [0, 0.05], [1, 0]);
  const heroY = useTransform(progress, [0, 0.05], [0, -60]);
  const serviceInfoOpacity = useTransform(progress, [0.05, 0.12], [0, 1]);

  // Lite mode (mobile / reduced-motion): skip WebGL entirely.
  if (lite === null) {
    // First client tick — render the ink background to avoid a flash before detection.
    return <div className="h-screen w-full bg-ink" />;
  }
  if (lite) {
    return <StaticHero />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-ink"
      style={{ height: "360vh" }}
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D Canvas — fills sticky viewport */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 1, 6], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Building3D
                scrollRef={scrollRef}
                activeFloor={activeFloor}
                mouseRef={mouseRef}
                onSelect={focusFloor}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Subtle vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,23,42,0.6)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

        {/* Hero overlay text — visible before scroll */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <Container>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
                Sydney-wide property services
              </span>
              <div className="mt-6">
                <Hero3DTitle />
              </div>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                Scroll to explore our building — each floor is a service we deliver with precision across Sydney.
              </p>
              <div className="mt-8">
                <HeroQuoteButton />
              </div>
              <div className="mt-8 flex items-center gap-3 text-white/40">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </motion.div>
                <span className="text-sm">Scroll to explore</span>
              </div>
            </div>
          </Container>
        </motion.div>

        {/* Active service info panel */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-center"
          style={{ opacity: serviceInfoOpacity }}
        >
          <Container>
            <div className="flex items-center justify-between">
              <div className="max-w-md">
                {activeFloor >= 0 && activeFloor < SERVICE_DETAILS.length && (
                  <ServiceInfo
                    key={activeFloor}
                    service={SERVICE_DETAILS[activeFloor]}
                    index={activeFloor}
                    total={SERVICE_DETAILS.length}
                  />
                )}
              </div>

              {/* Floor indicator — each links to its service page */}
              <div
                className={cn(
                  "hidden flex-col items-end gap-2 lg:flex",
                  activeFloor >= 0 ? "pointer-events-auto" : "pointer-events-none"
                )}
              >
                {SERVICE_DETAILS.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => focusFloor(i)}
                    className="group flex items-center gap-3"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300 group-hover:text-gold",
                        i === activeFloor ? "text-gold" : "text-white/40"
                      )}
                    >
                      {s.name}
                    </span>
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-500 group-hover:bg-gold",
                        i === activeFloor
                          ? "w-8 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          : "w-2 bg-white/30"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </Container>
        </motion.div>

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-gold-soft"
            style={{ scaleX: progress, transformOrigin: "left" }}
          />
        </div>
      </div>
    </div>
  );
}

function ServiceInfo({
  service,
  index,
  total,
}: {
  service: (typeof SERVICE_DETAILS)[number];
  index: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-ink/50 p-7 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-widest text-white/40">
          Floor {index + 1} of {total}
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
        {service.name}
      </h2>
      <p className="mt-2 text-base font-medium text-gold">{service.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/65">
        {service.description}
      </p>

      <Link
        href={`/services/${service.slug}`}
        className="group mt-6 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/5 px-5 py-2.5 text-sm font-semibold text-gold transition-all duration-200 hover:border-gold hover:bg-gold hover:text-ink"
      >
        View {service.name}
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </motion.div>
  );
}
