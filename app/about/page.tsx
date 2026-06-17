import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Vyntra — A Modern Property Services Company",
  description:
    "Vyntra Property Services is a modern, technology-driven property maintenance and cleaning company built for property managers, strata managers and businesses across Sydney.",
  alternates: { canonical: "/about" },
};

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
                {/* Premium stock photo — swap for real Vyntra project photography. */}
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="A premium Sydney property maintained to the Vyntra standard"
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
                    photo-verified quality and clear communication aren&apos;t
                    extras — they&apos;re how we work as standard.
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

      {/* Why choose Vyntra */}
      <WhyChoose />

      <CTASection
        title="Experience a better property partner"
        subtitle="See why Sydney's property professionals are switching to Vyntra. Get a free, no-obligation quote today."
      />
    </>
  );
}
