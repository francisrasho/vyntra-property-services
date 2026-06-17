import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd, faqSchema } from "@/lib/seo";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQ — Vyntra Property Services",
  description:
    "Answers to common questions about Vyntra's property maintenance and cleaning services, coverage, insurance, pricing and how to get started in Sydney.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything you need to know about working with Vyntra. Can't find your answer? Get in touch — we're happy to help."
      />
      <FAQ showHeading={false} />
      <CTASection />
    </>
  );
}
