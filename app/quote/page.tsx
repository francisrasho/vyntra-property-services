import type { Metadata } from "next";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { QuoteForm } from "@/components/forms/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Free Quote — Vyntra Property Services",
  description:
    "Request a free, no-obligation quote for cleaning, maintenance or property services anywhere in Sydney. Takes under a minute.",
  alternates: { canonical: "/quote" },
};

const reasons = [
  {
    icon: ShieldCheck,
    title: "Fully insured & vetted",
    text: "Police-checked, professional contractors and comprehensive insurance on every job.",
  },
  {
    icon: Clock,
    title: "Fast response",
    text: "Most quotes turned around within one to two business days — emergencies sooner.",
  },
  {
    icon: CheckCircle2,
    title: "No obligation",
    text: "Transparent, itemised pricing with no lock-in and no pressure. Ever.",
  },
];

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Free quote"
        title="Get your free, no-obligation quote"
        subtitle="Tell us about your property and what you need. It takes under a minute, and there's no obligation."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Why request a quote with Vyntra?
              </h2>
              <ul className="mt-8 space-y-6">
                {reasons.map((r) => (
                  <li key={r.title} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-gold">
                      <r.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-ink">{r.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">
                        {r.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-ink/[0.08] bg-surface p-6 shadow-[var(--shadow-glass)] sm:p-8">
              <QuoteForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
