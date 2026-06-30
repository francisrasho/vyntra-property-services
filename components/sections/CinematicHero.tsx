"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/data/company";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

/** Headline mirrors the brand wordmark; gold accents stay on the same words. */
const HEADLINE = [
  { t: "Sydney's" },
  { t: "Premium" },
  { t: "Property", gold: true },
  { t: "Services", gold: true },
  { t: "Partner" },
];

/**
 * SECTION 1 — full-screen cinematic hero built on luxuryhouseatdark.webp.
 * Ken Burns zoom (CSS) + dark gradient overlays + mouse parallax + floating
 * particles + staggered headline reveal + animated CTAs + scroll indicator.
 */
export function CinematicHero() {
  const root = useRef<HTMLElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Staggered entrance.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, 0.1)
          .from(
            ".hero-word",
            { y: 44, opacity: 0, filter: "blur(8px)", duration: 1, stagger: 0.09 },
            0.2,
          )
          .from(".hero-sub", { y: 24, opacity: 0, duration: 0.9 }, 0.7)
          .from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.85)
          .from(".hero-scroll", { opacity: 0, duration: 1 }, 1.2);

        // Subtle mouse parallax on the backdrop.
        const xTo = gsap.quickTo(imageWrap.current, "x", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(imageWrap.current, "y", { duration: 0.8, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * -36);
          yTo((e.clientY / window.innerHeight - 0.5) * -36);
        };
        window.addEventListener("pointermove", onMove);

        // Gentle scroll-driven drift as the hero leaves the viewport.
        gsap.to(imageWrap.current, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink text-white"
    >
      {/* Backdrop: oversized wrapper (parallax headroom) + inner Ken Burns zoom. */}
      <div ref={imageWrap} className="absolute -inset-[10%] -z-10">
        <div className="absolute inset-0 animate-kenburns">
          <Image
            src="/luxuryhouseatdark.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Dark gradient overlays for legibility + blend into the next section. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/45 to-ink" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/75 via-transparent to-transparent" />
      <Particles className="-z-10 opacity-70" />

      <Container className="relative z-10 pb-32 pt-28">
        <div className="max-w-3xl">
          <p className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft backdrop-blur-sm">
            Sydney-wide property services
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.75rem]">
            {HEADLINE.map((w, i) => (
              <span
                key={i}
                className={cn("hero-word mr-[0.25em] inline-block", w.gold && "text-gold")}
              >
                {w.t}
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            Professional cleaning, maintenance and property solutions trusted by
            property managers, strata managers and businesses across Sydney.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="hero-cta">
              <Magnetic>
                <QuoteButton size="lg">
                  Get Free Quote <ArrowRight className="h-4 w-4" />
                </QuoteButton>
              </Magnetic>
            </span>
            <span className="hero-cta">
              <Button
                href="#services"
                variant="outline"
                size="lg"
                className="border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-gold hover:text-gold"
              >
                Explore Our Work
              </Button>
            </span>
            <span className="hero-cta">
              <Button
                href={`tel:${company.phone}`}
                external
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4" /> Call Now
              </Button>
            </span>
          </div>
        </div>
      </Container>

      {/* Scroll indicator — a quiet downward cue, no bounce. */}
      <a
        href="#services"
        aria-label="Scroll to explore"
        className="hero-scroll group absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <span className="scroll-cue-line absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent to-gold" />
        </span>
      </a>
    </section>
  );
}
