import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MonoReadout } from "@/components/ui/os";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About — Technology-enabled property care, Sydney",
  description:
    "Vyntra is a technology-enabled property maintenance and cleaning company in Sydney. Every job scoped, checklisted and photo-verified through Vyntra OS — documented and accountable.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    tag: "Accountability",
    title: "Nothing is complete until it's verified",
    body: "Every job is scoped before it starts and photo-verified against that scope before it's marked done. The record is the product — the work is just how we get there.",
  },
  {
    tag: "Documentation",
    title: "A permanent history for every property",
    body: "Each completed job is filed into your property's history through Vyntra OS, so owners, managers and tenants always have a clear, checkable record.",
  },
  {
    tag: "People",
    title: "Vetted, insured, accountable",
    body: "The people in your building are police-checked, insured and rated. You see who's coming, their credentials, and exactly what they did.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Vyntra"
        title="We don't just maintain property. We account for it."
        subtitle="Vyntra is a technology-enabled property maintenance and cleaning company in Sydney. We pair reliable, premium work with Vyntra OS — the system that documents and verifies every job."
      />

      <section className="py-20">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="What we believe"
            title="Premium isn't what you say. It's what you can prove."
            subtitle="Anyone can promise reliability. We built a company where every claim is backed by a documented, verifiable record."
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {principles.map((p) => (
              <div key={p.tag} className="bg-paper p-7">
                <MonoReadout className="text-brass">{p.tag}</MonoReadout>
                <h3 className="mt-4 font-serif text-xl font-medium text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
