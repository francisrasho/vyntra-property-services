"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

type Panel = {
  img: string;
  space: string;
  service: string;
  href: string;
  copy: string;
};

/** Each room maps to the Vyntra service line that space showcases. */
const PANELS: Panel[] = [
  {
    img: "/kitchen.webp",
    space: "Kitchen",
    service: "End of Lease Cleaning",
    href: "/services/end-of-lease-cleaning",
    copy: "Detail-driven kitchen cleans that pass inspection the first time — every surface left handover-ready.",
  },
  {
    img: "/livingroom.webp",
    space: "Living Room",
    service: "Property Maintenance",
    href: "/services/property-maintenance",
    copy: "Interiors kept immaculate and in perfect repair, with one accountable partner for every detail.",
  },
  {
    img: "/garage.webp",
    space: "Garage",
    service: "Pressure Washing",
    href: "/services/pressure-washing",
    copy: "High-pressure cleaning that lifts oil, grime and years of wear from concrete and hard surfaces.",
  },
  {
    img: "/outdoor.webp",
    space: "Outdoor",
    service: "Garden Maintenance",
    href: "/services/garden-maintenance",
    copy: "Grounds and outdoor spaces that always look cared for — sharp and presentable, season after season.",
  },
  {
    img: "/office.webp",
    space: "Office",
    service: "Office Cleaning",
    href: "/services/office-cleaning",
    copy: "Discreet, after-hours cleaning that keeps workspaces healthy, hygienic and presentation-perfect.",
  },
  {
    img: "/warehouse.webp",
    space: "Warehouse",
    service: "Commercial Cleaning",
    href: "/services/commercial-cleaning",
    copy: "Large-format commercial and industrial cleaning, audited and delivered to a documented standard.",
  },
];

/**
 * SECTION 2 — cinematic full-screen image panels, one per space. Each image
 * parallaxes and gently scales on scrub; the copy fades and rises into view as
 * the panel enters. Alternating alignment keeps the sequence feeling editorial.
 */
export function ServicePanels() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".svc-panel").forEach((panel) => {
          const img = panel.querySelector(".svc-img");
          const reveal = panel.querySelectorAll(".svc-reveal");

          // Parallax drift + subtle scale across the panel's scroll range.
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          // Staggered content reveal as the panel comes into view.
          gsap.from(reveal, {
            y: 44,
            opacity: 0,
            filter: "blur(6px)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: panel, start: "top 65%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} className="relative bg-ink">
      {PANELS.map((p, i) => {
        const right = i % 2 === 1;
        return (
          <article
            key={p.space}
            className="svc-panel relative flex min-h-[88vh] items-end overflow-hidden"
          >
            {/* Oversized wrapper gives the parallax/scale room without edge bleed. */}
            <div className="svc-img absolute -inset-[8%]">
              <Image
                src={p.img}
                alt={`${p.space} — ${p.service}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
            <div
              className={cn(
                "absolute inset-0",
                right
                  ? "bg-gradient-to-l from-ink/70 via-transparent to-transparent"
                  : "bg-gradient-to-r from-ink/70 via-transparent to-transparent",
              )}
            />

            <Container className="relative z-10 pb-20 pt-32">
              <div className={cn("max-w-xl", right && "ml-auto text-right")}>
                <p className="svc-reveal text-sm font-semibold uppercase tracking-[0.3em] text-gold-soft">
                  {String(i + 1).padStart(2, "0")} — {p.service}
                </p>
                <h2 className="svc-reveal mt-4 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {p.space}
                </h2>
                <p className="svc-reveal mt-5 text-lg leading-relaxed text-white/75">
                  {p.copy}
                </p>
                <div className={cn("svc-reveal mt-8 flex", right && "justify-end")}>
                  <Link
                    href={p.href}
                    className="group inline-flex h-14 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-white/10 hover:text-gold hover:shadow-[0_0_44px_rgba(212,175,55,0.28)]"
                  >
                    Explore {p.service}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Container>
          </article>
        );
      })}
    </section>
  );
}
