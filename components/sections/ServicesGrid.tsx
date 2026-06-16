import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/icon";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function ServicesGrid({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="services" className="py-24">
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow="What we do"
            title="Property services, done to a premium standard"
            subtitle="One trusted partner for cleaning, maintenance and property care across Sydney — delivered with documented scopes and total accountability."
          />
        )}

        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${showHeading ? "mt-14" : ""}`}>
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-ink/[0.08] bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-glass)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  {s.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-ink-600">Not sure which service you need?</p>
          <QuoteButton size="lg">Get a Free Quote</QuoteButton>
        </div>
      </Container>
    </section>
  );
}
