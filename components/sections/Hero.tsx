"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CalendarCheck, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/ui/Particles";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { company } from "@/data/company";
import { ease } from "@/lib/motion";
import { TrustBar } from "./TrustBar";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export function Hero() {
  const reduced = useReducedMotion();
  const itemProps = reduced ? {} : { variants: item };

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink pb-24 pt-28 text-white">
      <Particles />
      {/* Soft gradient glows */}
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

          <motion.h1
            {...itemProps}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-[4.5rem]"
          >
            Sydney&apos;s Premium{" "}
            <span className="text-gold">Property Services</span> Partner
          </motion.h1>

          <motion.p
            {...itemProps}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            Professional cleaning, maintenance and property solutions trusted by
            property managers, strata managers and businesses across Sydney.
          </motion.p>

          <motion.div {...itemProps} className="mt-8 flex flex-wrap items-center gap-3">
            <QuoteButton size="lg">
              Get Free Quote <ArrowRight className="h-4 w-4" />
            </QuoteButton>
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
