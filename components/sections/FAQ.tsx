"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

export function FAQ({ showHeading = true }: { showHeading?: boolean } = {}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-travertine py-24">
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            subtitle="Everything you need to know about working with Vyntra. Can't find your answer? Just ask."
          />
        )}

        <div
          className={`mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line bg-paper ${showHeading ? "mt-12" : ""}`}
        >
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={cn(i > 0 && "border-t border-line")}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium text-ink">{f.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-brass transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-ink-600">
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
