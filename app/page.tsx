import { CinematicHero } from "@/components/sections/CinematicHero";
import { ServicePanels } from "@/components/sections/ServicePanels";
import { CleaningShowcase } from "@/components/sections/CleaningShowcase";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";
import { ScrollTriggerBridge } from "@/components/providers/ScrollTriggerBridge";

export default function Home() {
  return (
    <>
      {/* Syncs GSAP ScrollTrigger with Lenis for the cinematic sections below. */}
      <ScrollTriggerBridge />
      <CinematicHero />
      <ServicePanels />
      <CleaningShowcase />
      <Stats />
      <Testimonials limit={3} showVideoPlaceholder={false} />
      <CTASection />
    </>
  );
}
