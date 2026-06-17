"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, CalendarCheck, PhoneCall } from "lucide-react";
import { Fragment, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/data/company";
import { ease, wordReveal } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { TrustBar } from "./TrustBar";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const HEADLINE = [
  { t: "Sydney's" },
  { t: "Premium" },
  { t: "Property", gold: true },
  { t: "Services", gold: true },
  { t: "Partner" },
];

export function Hero() {
  const reduced = useReducedMotion();
  const itemProps = reduced ? {} : { variants: item };

  const sectionRef = useRef<HTMLElement>(null);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(24);
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${glowX}% ${glowY}%, rgba(212,175,55,0.16), transparent 60%)`;

  function handleMouseMove(e: React.MouseEvent) {
    if (reduced) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pb-24 pt-28 text-white"
    >
      <Particles />
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />
      )}
      <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold/[0.06] blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/0 to-ink" />

      <Container className="relative z-10">
        <motion.div
          className="max-w-3xl"
          variants={reduced ? undefined : container}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "show"}
        >
          <motion.span
            {...itemProps}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft"
          >
            Sydney-wide property services
          </motion.span>

          {reduced ? (
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-[4.5rem]">
              Sydney&apos;s Premium{" "}
              <span className="text-gold">Property Services</span> Partner
            </h1>
          ) : (
            <motion.h1
              className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.5rem]"
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: { staggerChildren: 0.09, delayChildren: 0.25 },
                },
              }}
            >
              {HEADLINE.map((w, i) => (
                <Fragment key={i}>
                  <motion.span
                    variants={wordReveal}
                    className={cn("inline-block", w.gold && "text-gold")}
                  >
                    {w.t}
                  </motion.span>
                  {i < HEADLINE.length - 1 ? " " : null}
                </Fragment>
              ))}
            </motion.h1>
          )}

          <motion.p
            {...itemProps}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Professional cleaning, maintenance and property solutions trusted by
            property managers, strata managers and businesses across Sydney.
          </motion.p>

          <motion.div {...itemProps} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <QuoteButton size="lg">
                Get Free Quote <ArrowRight className="h-4 w-4" />
              </QuoteButton>
            </Magnetic>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 text-white hover:border-gold hover:text-gold"
            >
              <CalendarCheck className="h-4 w-4" /> Book a Consultation
            </Button>
            <Button
              href={`tel:${company.phone}`}
              external
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <PhoneCall className="h-4 w-4" /> Call Now
            </Button>
          </motion.div>

          <motion.div {...itemProps} className="mt-10">
            <TrustBar />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
