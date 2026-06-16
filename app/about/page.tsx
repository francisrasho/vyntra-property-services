import type { Metadata } from "next";
import Image from "next/image";
import { Cpu, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Vyntra — A Modern Property Services Company",
  description:
    "Vyntra Property Services is a modern, technology-driven property maintenance and cleaning company built for property managers, strata managers and businesses across Sydney.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "Cpu",
    title: "Technology-driven",
    description:
      "Digital checklists, photo verification and live job tracking bring transparency to every visit — you don't just trust the work was done, you can see it.",
  },
  {
    icon: "ShieldCheck",
    title: "Genuinely accountable",
    description:
      "Documented scopes, audited quality and a single point of contact mean nothing falls through the cracks and someone always owns the outcome.",
  },
  {
    icon: "Handshake",
    title: "Built for partnerships",
    description:
      "We invest in understanding your properties and grow with you. We're not chasing one-off jobs — we're building long-term relationships.",
  },
  {
    icon: "Sparkles",
    title: "A premium standard",
    description:
      "From the first quote to the final inspection, every detail is handled with the polish your properties and reputation deserve.",
  },
];

const iconMap = { Cpu, ShieldCheck, Handshake, Sparkles };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Vyntra"
        title="A modern property services company, built for the future"
        subtitle="We combine reliability and professionalism with modern systems to make property management genuinely simple — for property managers, strata managers, businesses and owners across Sydney."
      />

      {/* Story */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[var(--shadow-glass)]">
                <Image
                  src="https://picsum.photos/seed/vyntra-about/1200/900"
                  alt="The Vyntra team at work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Property care, reimagined
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-ink-600">
                  <p>
                    Vyntra was founded on a simple belief: property services should
                    be reliable, transparent and genuinely professional — every
                    time, on every site. Too many providers over-promise and
                    under-deliver. We built Vyntra to be the opposite.
                  </p>
                  <p>
                    We bring together vetted, trained contractors and modern
                    technology to deliver a consistently premium standard across
                    cleaning, maintenance and property care. Documented scopes,
                    photo-verified quality and clear communication aren't extras —
                    they're how we work as standard.
                  </p>
                  <p>
                    The result is a property partner you can rely on: one point of
                    contact, total accountability, and a team genuinely invested in
                    protecting your asset and your reputation.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-bg py-20">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="The principles behind every job"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => {
              const Ico = iconMap[v.icon as keyof typeof iconMap];
              return (
                <Reveal key={v.title} delay={i * 0.05}>
                  <div className="flex h-full gap-5 rounded-2xl border border-ink/[0.08] bg-surface p-7">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-gold">
                      <Ico className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-ink">{v.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection
        title="Experience a better property partner"
        subtitle="See why Sydney's property professionals are switching to Vyntra. Get a free, no-obligation quote today."
      />
    </>
  );
}
