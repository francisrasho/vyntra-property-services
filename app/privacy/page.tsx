import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Vyntra Property Services collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
      />
      <section className="py-20">
        <Container>
          <div className="max-w-2xl space-y-5 leading-relaxed text-ink-600">
            <p>
              {company.legalName} (ABN {company.abn}) is committed to protecting
              your privacy. This page is a placeholder for our full privacy
              policy and will be completed before launch.
            </p>
            <p>
              We collect information you provide through our enquiry and quote
              forms — such as your name, contact details and property details —
              solely to respond to your request and deliver our services. We do
              not sell your information.
            </p>
            <p>
              For any privacy questions, contact us at{" "}
              <a
                href={`mailto:${company.email}`}
                className="text-ink underline decoration-line underline-offset-4 hover:text-brass"
              >
                {company.email}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
