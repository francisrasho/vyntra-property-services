import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Our Services — Cleaning & Property Maintenance Sydney",
  description:
    "Explore Vyntra's full range of commercial cleaning, strata, office, property maintenance, handyman, pressure washing, garden and end-of-lease services across Sydney.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Premium property services for every need"
        subtitle="One trusted partner for cleaning, maintenance and property care across Sydney — delivered with documented scopes, modern technology and total accountability."
      />
      <ServicesGrid showHeading={false} />
      <CTASection />
    </>
  );
}
