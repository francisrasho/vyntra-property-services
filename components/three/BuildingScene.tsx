"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Building3D } from "./Building3D";
import { StaticHero } from "./StaticHero";
import { MobileHero } from "./MobileHero";
import { Hero3DTitle } from "./Hero3DTitle";
import { HeroQuoteButton } from "./HeroQuoteButton";
import { Container } from "@/components/ui/Container";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/cn";

type DisplayMode = "pending" | "static" | "mobile" | "desktop";

/**
 * Decides how to render the hero:
 * - "static": reduced-motion users get the no-WebGL fallback.
 * - "mobile": small screens get the 3D building, tuned lighter for touch.
 * - "desktop": full 3D experience.
 */
function useDisplayMode(): DisplayMode {
  const [mode, setMode] = useState<DisplayMode>("pending");
  useEffect(() => {
    const compute = (): DisplayMode => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
      return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
    };
    setMode(compute());
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setMode(compute());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mode;
}

// Each service carries Vyntra OS telemetry: a live-activity line surfaced on the
// building, two property insights (digital-report data), and a before→after
// transformation the panel animates as the service activates the floor.
const SERVICE_DETAILS = [
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    tagline: "Spotless commercial spaces, every single day.",
    description: "Presentation-perfect cleaning for retail, hospitality, medical and commercial premises.",
    activity: "Night crew on site · Level 3",
    insights: [
      { label: "Sites serviced today", value: "42" },
      { label: "On-time rate", value: "99.2%" },
    ],
    transform: { label: "Presentation", from: 61, to: 96 },
  },
  {
    slug: "office-cleaning",
    name: "Office Cleaning",
    tagline: "A workplace your team is proud to walk into.",
    description: "Discreet, detail-driven cleaning that keeps workspaces healthy and professional.",
    activity: "Daily service in progress",
    insights: [
      { label: "Workstations cleared", value: "320" },
      { label: "Air quality", value: "Good" },
    ],
    transform: { label: "Workspace health", from: 68, to: 94 },
  },
  {
    slug: "strata-cleaning",
    name: "Strata Cleaning",
    tagline: "Common areas that lift the whole building.",
    description: "Comprehensive strata cleaning that protects asset value and keeps residents happy.",
    activity: "Common areas being serviced",
    insights: [
      { label: "Buildings managed", value: "18" },
      { label: "Resident rating", value: "4.9" },
    ],
    transform: { label: "Common-area score", from: 64, to: 95 },
  },
  {
    slug: "end-of-lease-cleaning",
    name: "End of Lease Cleaning",
    tagline: "Bond-back clean, guaranteed standard.",
    description: "Thorough cleans that meet agent standards and protect the bond.",
    activity: "Bond clean underway · Unit 12",
    insights: [
      { label: "Bond pass rate", value: "100%" },
      { label: "Turnaround", value: "24h" },
    ],
    transform: { label: "Inspection ready", from: 42, to: 98 },
  },
  {
    slug: "property-maintenance",
    name: "Property Maintenance",
    tagline: "One trusted partner for every property need.",
    description: "Planned and reactive maintenance that keeps your portfolio running smoothly.",
    activity: "2 work orders in progress",
    insights: [
      { label: "Open tickets", value: "6" },
      { label: "Avg response", value: "2.3h" },
    ],
    transform: { label: "Asset condition", from: 71, to: 93 },
  },
  {
    slug: "handyman-services",
    name: "Handyman Services",
    tagline: "The jobs on your list — handled properly.",
    description: "Skilled, reliable handyman work for repairs and improvements.",
    activity: "Repair scheduled · 2:30pm",
    insights: [
      { label: "Jobs this week", value: "37" },
      { label: "First-fix rate", value: "94%" },
    ],
    transform: { label: "Snag list cleared", from: 30, to: 92 },
  },
  {
    slug: "pressure-washing",
    name: "Pressure Washing",
    tagline: "Restore surfaces to like-new condition.",
    description: "High-pressure cleaning that strips grime from facades, car parks and paths.",
    activity: "Facade wash · South elevation",
    insights: [
      { label: "Surfaces restored", value: "1,240m²" },
      { label: "Grime removed", value: "98%" },
    ],
    transform: { label: "Surface restored", from: 38, to: 97 },
  },
  {
    slug: "garden-maintenance",
    name: "Garden Maintenance",
    tagline: "Grounds that always look cared for.",
    description: "Regular grounds upkeep that keeps exteriors sharp year-round.",
    activity: "Grounds team on site",
    insights: [
      { label: "Sites maintained", value: "64" },
      { label: "Green score", value: "A" },
    ],
    transform: { label: "Kerb appeal", from: 59, to: 95 },
  },
  {
    slug: "emergency-property-support",
    name: "Emergency Support",
    tagline: "When something goes wrong, we move fast.",
    description: "Rapid-response support for urgent property issues — available when you need it.",
    activity: "Rapid response · ETA 18 min",
    insights: [
      { label: "Avg arrival", value: "22 min" },
      { label: "Cover", value: "24/7" },
    ],
    transform: { label: "Issue contained", from: 12, to: 90 },
  },
];

export function BuildingScene() {
  const mode = useDisplayMode();
  // Only desktop runs WebGL; mobile gets the lightweight CSS-3D hero.
  const is3D = mode === "desktop";
  const isMobile = false;
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
    if (!is3D) return;
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
  }, [is3D, progress]);

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

  // First client tick — render the ink background to avoid a flash before detection.
  if (mode === "pending") {
    return <div className="h-screen w-full bg-ink" />;
  }
  // Reduced-motion users skip animation entirely.
  if (mode === "static") {
    return <StaticHero />;
  }
  // Phones get the lightweight CSS-3D tower (no WebGL).
  if (mode === "mobile") {
    return <MobileHero />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-ink"
      style={{ height: isMobile ? "320vh" : "360vh" }}
      onMouseMove={handleMouseMove}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Graded premium sky behind the canvas — cool aloft, a warm horizon glow,
            so the building reads against real space rather than flat black. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% -10%, #16213a 0%, #0d1526 42%, #080d18 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "radial-gradient(80% 120% at 50% 100%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 35%, transparent 70%)",
          }}
        />

        {/* 3D Canvas — fills sticky viewport */}
        <div className="absolute inset-0">
          <Canvas
            shadows
            camera={{ position: [0, 1, isMobile ? 8 : 6], fov: isMobile ? 55 : 45 }}
            dpr={isMobile ? [1, 1.25] : [1, 1.75]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.94,
            }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <Building3D
                isMobile={isMobile}
                scrollRef={scrollRef}
                activeFloor={activeFloor}
                mouseRef={mouseRef}
                onSelect={focusFloor}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Cinematic vignette — frames the model and deepens the corners. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(6,10,20,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080d18]/70 to-transparent" />

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
                A living property, powered by Vyntra OS. Scroll and watch each
                service come alive across the building — exactly how we run it across Sydney.
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

        {/* Live activity readout floating over the property — communicates what
            Vyntra is doing to the building right now, not how the building looks. */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[15%] z-10 hidden justify-center sm:flex"
          style={{ opacity: serviceInfoOpacity }}
        >
          {activeFloor >= 0 && activeFloor < SERVICE_DETAILS.length && (
            <LiveActivity
              key={activeFloor}
              label={SERVICE_DETAILS[activeFloor].name}
              activity={SERVICE_DETAILS[activeFloor].activity}
            />
          )}
        </motion.div>

        {/* Active service info panel — bottom on mobile, centre-left on desktop */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 flex items-end pb-24 sm:items-center sm:pb-0"
          style={{ opacity: serviceInfoOpacity }}
        >
          <Container>
            <div className="flex items-center justify-between">
              <div className="w-full sm:max-w-md">
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
                  "hidden flex-col items-end gap-2.5 lg:flex",
                  activeFloor >= 0 ? "pointer-events-auto" : "pointer-events-none"
                )}
              >
                {SERVICE_DETAILS.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => focusFloor(i)}
                    className="group flex items-center gap-3.5"
                  >
                    <span
                      className={cn(
                        "text-[0.9rem] font-medium tracking-tight transition-all duration-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] group-hover:text-white",
                        i === activeFloor ? "text-gold" : "text-white/60"
                      )}
                    >
                      {s.name}
                    </span>
                    <div
                      className={cn(
                        "h-[3px] rounded-full transition-all duration-500 ease-out group-hover:bg-gold-soft",
                        i === activeFloor
                          ? "w-9 bg-gradient-to-r from-gold-soft to-gold shadow-[0_0_14px_rgba(212,175,55,0.7)]"
                          : "w-3.5 bg-white/35"
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

function LiveActivity({ label, activity }: { label: string; activity: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-black/35 px-4 py-2 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">Live</span>
      <span className="h-3.5 w-px bg-white/15" />
      <span className="text-[13px] font-medium text-white/85">
        <span className="text-white/45">{label} · </span>
        {activity}
      </span>
    </motion.div>
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
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[20px] border border-white/[0.12] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="text-base font-bold tabular-nums text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/40 via-white/10 to-transparent" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Floor {index + 1} of {total}
        </span>
      </div>

      <h2 className="mt-4 text-[1.7rem] font-bold leading-[1.1] tracking-tight text-white sm:mt-5 sm:text-[2.35rem]">
        {service.name}
      </h2>
      <p className="mt-2.5 text-[0.95rem] font-medium text-gold-soft sm:text-base">
        {service.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/65 sm:mt-3.5">
        {service.description}
      </p>

      {/* Vyntra OS telemetry — the property's live data, not decoration. */}
      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Vyntra OS · Live
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {service.insights.map((stat) => (
            <div key={stat.label}>
              <div className="text-lg font-bold tabular-nums leading-none text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] leading-tight text-white/45">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Before → after transformation the service performs on this floor. */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-medium text-white/50">
            <span>{service.transform.label}</span>
            <span className="tabular-nums text-gold-soft">
              {service.transform.from}
              <span className="mx-1 text-white/30">→</span>
              {service.transform.to}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              key={service.slug}
              className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold"
              initial={{ width: `${service.transform.from}%` }}
              animate={{ width: `${service.transform.to}%` }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            />
          </div>
        </div>
      </div>

      <Link
        href={`/services/${service.slug}`}
        className="group mt-5 inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/[0.08] px-5 py-3 text-sm font-semibold text-gold shadow-[0_8px_24px_-12px_rgba(212,175,55,0.55)] transition-all duration-300 ease-out hover:border-gold hover:bg-gold hover:text-ink hover:shadow-[0_12px_30px_-10px_rgba(212,175,55,0.7)]"
      >
        View {service.name}
        <svg
          className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
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
