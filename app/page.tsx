import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Marquee />
      <ServicesGrid />
      <Testimonials limit={3} showVideoPlaceholder={false} />
      <CTASection />
    </>
  );
}
