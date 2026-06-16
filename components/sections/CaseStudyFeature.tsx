import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function CaseStudyFeature() {
  const cs = caseStudies[0];

  return (
    <section className="py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-glass)]">
              <Image
                src={cs.image}
                alt={cs.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
                {cs.category}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-dark">
                Case study
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {cs.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-600">{cs.summary}</p>

              <div className="mt-7 grid grid-cols-3 gap-4 border-y border-ink/10 py-6">
                {cs.results.map((r) => (
                  <div key={r.label}>
                    <div className="text-2xl font-bold text-gold-dark sm:text-3xl">
                      {r.value}
                    </div>
                    <div className="mt-1 text-xs text-ink-600">{r.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`/case-studies/${cs.slug}`}>
                  Read the case study <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/case-studies" variant="outline">
                  All case studies
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
