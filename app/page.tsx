import { PanoramaHero } from "@/components/hero/DynamicPanoramaHero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <PanoramaHero />
      <Stats />
      <Marquee />
      <Testimonials limit={3} showVideoPlaceholder={false} />
      <CTASection />
    </>
  );
}
