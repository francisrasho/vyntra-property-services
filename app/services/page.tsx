import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesIndex } from "@/components/sections/home/ServicesIndex";
import { CTASection } from "@/components/sections/CTASection";
import { QuoteButton } from "@/components/forms/QuoteButton";

export const metadata: Metadata = {
  title: "Services — Cleaning & Property Maintenance Sydney",
  description:
    "Vyntra's full range of commercial, office and strata cleaning, property maintenance, handyman, pressure washing, garden and end-of-lease services across Sydney — every job documented and verified.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="One accountable partner for every property need"
        subtitle="Cleaning, maintenance and property care across Sydney — delivered with documented scopes, photo verification and total accountability."
      >
        <QuoteButton size="lg" variant="ondark">
          Open a property
        </QuoteButton>
      </PageHeader>
      <ServicesIndex />
      <CTASection />
    </>
  );
}
