import { Hero } from "@/components/sections/home/Hero";
import { LiveSignal } from "@/components/sections/home/LiveSignal";
import { RecordWalkthrough } from "@/components/sections/home/RecordWalkthrough";
import { RecordsPreview } from "@/components/sections/home/RecordsPreview";
import { VerifiedPeople } from "@/components/sections/home/VerifiedPeople";
import { ServicesIndex } from "@/components/sections/home/ServicesIndex";
import { FinalCta } from "@/components/sections/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <LiveSignal />
      <RecordWalkthrough />
      <RecordsPreview />
      <VerifiedPeople />
      <ServicesIndex />
      <FinalCta />
    </>
  );
}
