"use client";

import Image from "next/image";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { gsap, useGSAP } from "@/lib/gsap";

const POINTS = [
  "Hospital-grade sanitisation of every high-touch surface",
  "Trained, fully insured, police-checked cleaning professionals",
  "Digital checklists and photo verification on every visit",
  "Eco-conscious products — tough on grime, gentle on surfaces",
];

/**
 * SECTION 3 — premium cleaning showcase built on cleaning.webp. Full-bleed
 * parallax image behind a quiet editorial column of proof points and a CTA.
 */
export function CleaningShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".clean-img",
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        gsap.from(".clean-reveal", {
          y: 44,
          opacity: 0,
          filter: "blur(6px)",
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 60%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-32 text-white"
    >
      <div className="clean-img absolute -inset-[8%]">
        <Image
          src="/cleaning.webp"
          alt="Vyntra premium cleaning detail"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <Container className="relative z-10">
        <div className="max-w-xl">
          <p className="clean-reveal text-sm font-semibold uppercase tracking-[0.3em] text-gold-soft">
            The Vyntra Standard
          </p>
          <h2 className="clean-reveal mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            A clean you can see, and standards you can prove
          </h2>
          <p className="clean-reveal mt-6 text-lg leading-relaxed text-white/75">
            Cleaning isn&apos;t just presentation — it&apos;s protection for
            your asset and your reputation. Every Vyntra clean is documented,
            audited and delivered by people who treat your property like their
            own.
          </p>

          <ul className="clean-reveal mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/85">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          <div className="clean-reveal mt-10">
            <Magnetic>
              <QuoteButton size="lg">Book a Cleaning Quote</QuoteButton>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  );
}
