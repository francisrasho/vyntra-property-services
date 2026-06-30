import { ScrollTriggerBridge } from "@/components/providers/ScrollTriggerBridge";
import { CinematicLoader } from "@/components/experience/CinematicLoader";
import { HeroHouse } from "@/components/experience/HeroHouse";
import { ServiceScene } from "@/components/experience/ServiceScene";
import { CleaningShowcase } from "@/components/sections/CleaningShowcase";
import { CTASection } from "@/components/sections/CTASection";
import { scenes } from "@/data/experience";

export default function Home() {
  return (
    <>
      {/* A guided exploration of a property: a cinematic intro, the house with
          interactive hotspots, and a flythrough of full-screen service scenes. */}
      <CinematicLoader />
      <ScrollTriggerBridge />
      <HeroHouse />
      {scenes.map((scene, i) => (
        <ServiceScene key={scene.id} scene={scene} priority={i === 0} />
      ))}
      <CleaningShowcase />
      <CTASection
        title="Ready to experience the Vyntra difference?"
        subtitle="From a single repair to your entire portfolio — explore what one trusted, accountable property partner can do for you."
      />
    </>
  );
}
