import type { Metadata } from "next";
import { Clock, Mail, MapPin, PhoneCall } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact Vyntra — Get a Free Property Services Quote",
  description:
    "Get in touch with Vyntra Property Services for a free quote, a consultation or 24/7 emergency property support anywhere in Sydney.",
  alternates: { canonical: "/contact" },
};

const mapQuery = encodeURIComponent(
  `${company.address.suburb} ${company.address.state} ${company.address.postcode}`,
);

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your property"
        subtitle="Request a free quote, book a consultation, or reach our team directly. We respond to most enquiries the same business day."
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                Tell us about your property and what you need — we&apos;ll be in
                touch shortly.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              <div className="rounded-2xl border border-ink/[0.08] bg-surface p-6">
                <h3 className="text-sm font-semibold text-ink">Get in touch</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    <a href={`tel:${company.phone}`} className="text-ink hover:text-gold-dark">
                      {company.phoneDisplay}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    <a href={`mailto:${company.email}`} className="text-ink hover:text-gold-dark">
                      {company.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    <span className="text-ink-600">
                      {company.address.suburb}, {company.address.state}{" "}
                      {company.address.postcode}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-ink/[0.08] bg-surface p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Clock className="h-4 w-4 text-gold-dark" /> Business hours
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-ink-600">
                  {company.hours.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4">
                      <span>{h.days}</span>
                      <span className="font-medium text-ink">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Map */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-ink/10">
            <iframe
              title="Vyntra service area map"
              src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
