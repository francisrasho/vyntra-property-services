"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { Viewer } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/data/company";
import { cn } from "@/lib/cn";
import { HERO_ZONES, PANORAMA_SRC, PANORAMA_VIEW } from "./panorama-data";
import { ServicePanel } from "./ServicePanel";
import { ServiceSelectorFallback } from "./ServiceSelectorFallback";

function detectWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function markerHtml(accent: string, alert: boolean) {
  return `<span class="vy-hotspot${alert ? " vy-hotspot--alert" : ""}" style="--vy-accent:${accent}">
    <span class="vy-hotspot__ring"></span>
    <span class="vy-hotspot__dot"></span>
  </span>`;
}

/** The interactive 360° viewer. Mounted only when WebGL is available. */
function PanoramaViewer({
  activeIndex,
  onSelect,
  reduced,
}: {
  activeIndex: number | null;
  onSelect: (index: number) => void;
  reduced: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const autorotateRef = useRef<AutorotatePlugin | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Create the viewer once.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const viewer = new Viewer({
      container: host,
      panorama: PANORAMA_SRC,
      defaultYaw: `${PANORAMA_VIEW.defaultYaw}deg`,
      defaultPitch: `${PANORAMA_VIEW.defaultPitch}deg`,
      defaultZoomLvl: PANORAMA_VIEW.defaultZoom,
      navbar: false,
      mousewheel: false, // let the page scroll past the hero instead of zooming
      touchmoveTwoFingers: false,
      loadingTxt: "Loading property…",
      moveSpeed: 1.1,
      plugins: [
        [
          MarkersPlugin,
          {
            markers: HERO_ZONES.map((z, i) => ({
              id: z.id,
              position: { yaw: `${z.yaw}deg`, pitch: `${z.pitch}deg` },
              html: markerHtml(z.accent, !!z.alert),
              size: { width: 36, height: 36 },
              anchor: "center center",
              className: "vy-marker",
              tooltip: { content: z.zone, position: "top center" },
              data: { index: i },
            })),
          },
        ],
        [
          AutorotatePlugin,
          {
            autorotateSpeed: "0.25rpm",
            autostartDelay: 2500,
            autostartOnIdle: false,
          },
        ],
      ],
    });
    viewerRef.current = viewer;

    const markers = viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
    const autorotate = viewer.getPlugin<AutorotatePlugin>(AutorotatePlugin);
    autorotateRef.current = autorotate;

    const handleSelect = (e: unknown) => {
      const marker = (e as { marker?: { data?: { index?: number } } }).marker;
      const idx = marker?.data?.index;
      if (typeof idx === "number") onSelectRef.current(idx);
    };
    markers.addEventListener("select-marker", handleSelect);

    const stopAuto = () => autorotate.stop();
    host.addEventListener("pointerdown", stopAuto);

    return () => {
      markers.removeEventListener("select-marker", handleSelect);
      host.removeEventListener("pointerdown", stopAuto);
      viewer.destroy();
      viewerRef.current = null;
      autorotateRef.current = null;
    };
  }, []);

  // Smoothly pan to the active zone whenever it changes (markers or navigator).
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || activeIndex == null) return;
    const z = HERO_ZONES[activeIndex];
    autorotateRef.current?.stop();
    viewer.animate({
      yaw: `${z.yaw}deg`,
      pitch: `${z.pitch}deg`,
      zoom: 58,
      speed: reduced ? 0 : 1300,
    });
  }, [activeIndex, reduced]);

  return <div ref={hostRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

export function PanoramaHero() {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  // Reduced-motion or no WebGL → clean, motion-light service selector.
  const useFallback = reduced === true || webgl === false;
  const ready = webgl !== null;

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-ink text-white">
      {/* Visual layer: 360° viewer or fallback selector backdrop */}
      <div className="absolute inset-0">
        {ready && !useFallback && (
          <PanoramaViewer
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            reduced={!!reduced}
          />
        )}
      </div>

      {/* Readability gradients over the panorama */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/90 to-transparent" />

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center py-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
            Sydney-wide property services
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Sydney&apos;s Premium{" "}
            <span className="text-gold">Property Services</span> Partner
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
            Step inside a Vyntra-managed property. Look around, explore each
            service area, and see exactly how we keep buildings across Sydney
            immaculate.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <QuoteButton size="lg">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </QuoteButton>
            </Magnetic>
            <Button
              href={`tel:${company.phone}`}
              external
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 text-white hover:border-gold hover:text-gold"
            >
              <PhoneCall className="h-4 w-4" /> Call Now
            </Button>
          </div>

          {/* Interaction hint (viewer) */}
          {!useFallback && (
            <p className="mt-8 text-sm text-white/45">
              Drag to look around · tap a glowing hotspot to explore a service
            </p>
          )}
        </div>

        {/* Fallback selector lives in normal flow under the copy */}
        {useFallback && (
          <div className="mt-10 max-w-2xl">
            <ServiceSelectorFallback activeIndex={activeIndex} onSelect={setActiveIndex} />
          </div>
        )}
      </Container>

      {/* Zone navigator — click to move between service areas (viewer only) */}
      {!useFallback && (
        <div className="absolute inset-x-0 bottom-7 z-10 flex justify-center px-4">
          <div className="pointer-events-auto flex max-w-[92vw] items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-ink/50 px-2 py-2 backdrop-blur-xl">
            {HERO_ZONES.map((z, i) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={z.zone}
                aria-pressed={i === activeIndex}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
                  i === activeIndex
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:text-white"
                )}
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{ backgroundColor: z.accent }}
                />
                {z.zone}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium service panel — right on desktop, bottom sheet on mobile */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-24 sm:inset-y-0 sm:right-6 sm:left-auto sm:items-center sm:justify-end sm:px-0 sm:pb-0">
        <AnimatePresence mode="wait">
          {activeIndex !== null && (
            <ServicePanel
              key={HERO_ZONES[activeIndex].id}
              zone={HERO_ZONES[activeIndex]}
              onClose={() => setActiveIndex(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
