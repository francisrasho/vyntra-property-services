"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { useLenis } from "@/components/providers/SmoothScroll";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ExperienceScene } from "@/data/experience";

const flyEase = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A full-screen service "scene". As it enters view the image pushes in like a
 * camera moving into the space, and the copy rises into place. Carries the
 * scene's CTA plus a way back up to the house.
 */
export function ServiceScene({
  scene,
  priority = false,
}: {
  scene: ExperienceScene;
  priority?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Camera push-in on arrival.
        gsap.fromTo(
          ".scene-img",
          { scale: 1.16 },
          {
            scale: 1,
            ease: "power2.out",
            duration: 1.6,
            scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
          },
        );
        // Continuous parallax drift for depth.
        gsap.fromTo(
          ".scene-img",
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
        // Copy reveal.
        gsap.from(".scene-reveal", {
          y: 40,
          opacity: 0,
          filter: "blur(6px)",
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        });
      });
    },
    { scope: root },
  );

  const backToHouse = () => {
    const el = document.getElementById("house");
    if (lenis && el) lenis.scrollTo(el, { duration: 1.4, easing: flyEase });
    else el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id={scene.id}
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-white"
    >
      <div className="scene-img absolute -inset-[6%]">
        <Image
          src={scene.image}
          alt={`${scene.title} — ${scene.eyebrow}`}
          fill
          quality={90}
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Dark overlay + vignette for legible, cinematic depth. */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      <div className="absolute inset-0 [background:radial-gradient(120%_120%_at_50%_50%,transparent_52%,rgba(8,11,20,0.6)_100%)]" />

      <Container className="relative z-10">
        <div className="max-w-xl">
          <p className="scene-reveal text-sm font-semibold uppercase tracking-[0.3em] text-gold-soft">
            {scene.eyebrow}
          </p>
          <h2 className="scene-reveal mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {scene.title}
          </h2>
          <p className="scene-reveal mt-6 text-lg leading-relaxed text-white/75">
            {scene.description}
          </p>

          <div className="scene-reveal mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <QuoteButton size="lg">Get Quote</QuoteButton>
            </Magnetic>
            <Button
              onClick={backToHouse}
              variant="outline"
              size="lg"
              className="border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              <ArrowUp className="h-4 w-4" /> Back to House
            </Button>
          </div>

          <Link
            href={`/services/${scene.serviceSlug}`}
            className="scene-reveal mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-gold"
          >
            View {scene.title} details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
