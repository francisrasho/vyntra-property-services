import { PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MonoReadout } from "@/components/ui/os";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { company } from "@/data/company";

/** Reusable conversion band (interior pages). Calm, single door — no popups. */
export function CTASection({
  title = "Let's put your property on the record.",
  subtitle = "A free, no-obligation scope. See exactly how accountable property care works.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-12">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-graphite px-6 py-16 text-center text-ondark sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(198,162,104,0.18),transparent_65%)]" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <MonoReadout className="text-brass-soft">
              Your property, on the record
            </MonoReadout>
            <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-ondark-600">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <QuoteButton size="lg" variant="ondark">
                Open a property
              </QuoteButton>
              <Button
                href={`tel:${company.phone}`}
                external
                variant="outline"
                size="lg"
                className="border-line-dark text-ondark hover:border-brass hover:bg-white/5 hover:text-brass"
              >
                <PhoneCall className="h-4 w-4" /> {company.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
