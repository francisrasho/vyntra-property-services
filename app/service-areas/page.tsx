import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { serviceAreas } from "@/data/serviceAreas";

export const metadata: Metadata = {
  title: "Service Areas — Property Services Across Sydney",
  description:
    "Vyntra Property Services covers all of Greater Sydney — CBD, Eastern Suburbs, North Shore, Northern Beaches, Inner West, Hills District, Western Sydney and the Sutherland Shire.",
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coverage"
        title="Property services across Greater Sydney"
        subtitle="Wherever your property is, Vyntra delivers the same premium standard and fast response. Explore the regions we service."
      />

      <ServiceAreaMap showHeading={false} />

      <section className="pb-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.03}>
                <div className="h-full rounded-2xl border border-ink/[0.08] bg-surface p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-base font-bold text-ink">
                      <MapPin className="h-4 w-4 text-gold-dark" />
                      {a.name}
                    </h2>
                    <span className="whitespace-nowrap text-xs font-semibold text-gold-dark">
                      {a.responseTime}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {a.suburbs.join(" · ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Need property services in your area?"
        subtitle="Tell us where your property is and we'll confirm coverage and response times right away."
      />
    </>
  );
}
