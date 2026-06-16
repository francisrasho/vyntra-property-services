import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { CaseStudyFeature } from "@/components/sections/CaseStudyFeature";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ServicesGrid />
      <WhyChoose />
      <CaseStudyFeature />
      <GalleryPreview />
      <ServiceAreaMap />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
