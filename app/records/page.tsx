import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { RecordsArchive } from "@/components/records/RecordsArchive";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Records — A documented history of completed work",
  description:
    "The Vyntra archive: a register of completed property jobs across Sydney, each scoped, delivered and photo-verified. Consistency, documented — not a marketing portfolio.",
  alternates: { canonical: "/records" },
};

export default function RecordsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The archive"
        title="Every completed job becomes a record"
        subtitle="Not a portfolio of highlights — a documented history. Each record is scoped, delivered and photo-verified to the same standard. The consistency is the proof."
      />
      <RecordsArchive />
      <CTASection />
    </>
  );
}
