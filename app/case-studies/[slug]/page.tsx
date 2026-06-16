import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Quote } from "lucide-react";
import { getCaseStudy, caseStudySlugs } from "@/data/caseStudies";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: `/case-studies/${cs.slug}` },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Case Studies", url: "/case-studies" },
          { name: cs.title, url: `/case-studies/${cs.slug}` },
        ])}
      />

      <PageHeader eyebrow={cs.category} title={cs.title} subtitle={cs.summary} />

      {/* Results band */}
      <section className="border-b border-ink/10 bg-bg py-10">
        <Container>
          <div className="grid grid-cols-3 gap-6">
            {cs.results.map((r) => (
              <div key={r.label} className="text-center">
                <div className="text-3xl font-bold text-gold-dark sm:text-4xl">
                  {r.value}
                </div>
                <div className="mt-1 text-xs text-ink-600 sm:text-sm">
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Problem / Solution */}
      <section className="py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
                  The problem
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink">
                  {cs.problem}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
                  The solution
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink">
                  {cs.solution}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Before / After */}
      <section className="pb-20">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            The transformation
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-ink-600">
            Drag the slider to compare before and after.
          </p>
          <div className="mx-auto mt-10 max-w-3xl">
            <BeforeAfterSlider
              before={cs.beforeImage}
              after={cs.afterImage}
              alt={cs.title}
            />
          </div>
        </Container>
      </section>

      {/* Testimonial */}
      {cs.testimonial && (
        <section className="pb-20">
          <Container>
            <figure className="mx-auto max-w-3xl rounded-3xl bg-ink p-10 text-center text-white sm:p-14">
              <Quote className="mx-auto h-8 w-8 text-gold" />
              <blockquote className="mt-5 text-xl font-medium leading-relaxed text-balance sm:text-2xl">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-white/60">
                {cs.testimonial.name} · {cs.testimonial.role}
              </figcaption>
            </figure>
          </Container>
        </section>
      )}

      <CTASection />
    </>
  );
}
