import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing the use of the Vyntra Property Services website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The terms governing your use of this website and our services."
      />
      <section className="py-20">
        <Container>
          <div className="max-w-2xl space-y-5 leading-relaxed text-ink-600">
            <p>
              These terms are a placeholder and will be completed before launch.
              By using this website and engaging {company.legalName} (ABN{" "}
              {company.abn}), you agree to the terms set out here.
            </p>
            <p>
              Quotes are provided on the basis of the scope agreed at the time
              of enquiry. Services are delivered subject to our standard service
              agreement, provided with every engagement.
            </p>
            <p>
              Questions about these terms can be directed to{" "}
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
