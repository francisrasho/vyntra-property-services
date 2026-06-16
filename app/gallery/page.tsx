import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Gallery — Our Property Services Work in Sydney",
  description:
    "Browse Vyntra's recent commercial cleaning, strata, pressure washing and end-of-lease projects across Sydney — including before-and-after transformations.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="See the Vyntra standard"
        subtitle="A look at the spaces we transform and maintain across Sydney. Filter by service, or drag the before-and-after sliders to see the difference."
      />
      <section className="py-16">
        <GalleryGrid />
      </section>
      <CTASection />
    </>
  );
}
