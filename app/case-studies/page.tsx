import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Case Studies — Property Services Results in Sydney",
  description:
    "See how Vyntra solves real property challenges for strata, commercial and residential clients across Sydney — with measurable results.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Real results for real properties"
        subtitle="How Vyntra turns property challenges into outcomes that property managers, strata committees and owners can measure."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 0.05}>
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glass)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={cs.image}
                      alt={cs.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
                      {cs.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-lg font-bold text-ink">{cs.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                      {cs.summary}
                    </p>
                    <div className="mt-5 flex items-baseline gap-3 border-t border-ink/10 pt-4">
                      <span className="text-2xl font-bold text-gold-dark">
                        {cs.results[0].value}
                      </span>
                      <span className="text-xs text-ink-600">
                        {cs.results[0].label}
                      </span>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark">
                      Read case study
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
