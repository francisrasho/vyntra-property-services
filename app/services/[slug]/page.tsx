import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getService, services, serviceSlugs } from "@/data/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icon";
import { MonoReadout } from "@/components/ui/os";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: `${s.name} Sydney`,
    description: s.description,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.name, url: `/services/${service.slug}` },
        ])}
      />

      <PageHeader eyebrow="Service" title={service.name} subtitle={service.tagline}>
        <QuoteButton size="lg" variant="ondark">
          Open a property
        </QuoteButton>
      </PageHeader>

      {/* Problem / Solution */}
      <section className="py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-line bg-paper p-8">
                <MonoReadout className="text-ink-400">The challenge</MonoReadout>
                <p className="mt-3 text-lg leading-relaxed text-ink">
                  {service.problem}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl bg-graphite p-8 text-ondark">
                <MonoReadout className="text-brass-soft">
                  The Vyntra solution
                </MonoReadout>
                <p className="mt-3 text-lg leading-relaxed text-ondark">
                  {service.solution}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-graphite text-brass">
                <Icon name={service.icon} className="h-7 w-7" />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
                Why choose Vyntra
              </h2>
              <p className="mt-3 leading-relaxed text-ink-600">
                {service.description}
              </p>
              <div className="mt-6">
                <QuoteButton>Open a property</QuoteButton>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                  <span className="text-sm leading-relaxed text-ink-600">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-paper py-20">
        <Container>
          <h2 className="text-center font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
            How it works
          </h2>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-travertine p-6">
                  <span className="mono-readout tabular text-2xl text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-medium text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {p.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Related */}
      <section className="py-20">
        <Container>
          <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
            Related services
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40 hover:shadow-[var(--shadow-panel)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-graphite text-brass">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-medium text-ink">{s.name}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brass">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection title={`Ready to book ${service.name.toLowerCase()}?`} />
    </>
  );
}
