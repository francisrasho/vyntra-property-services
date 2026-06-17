import { PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Particles } from "@/components/ui/Particles";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { company } from "@/data/company";

/** Reusable full-width conversion band. */
export function CTASection({
  title = "Ready for property care done properly?",
  subtitle = "Get a free, no-obligation quote today and see why Sydney's property professionals choose Vyntra.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-12">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-16 text-center text-white sm:px-12">
          <Particles className="opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/15 blur-2xl" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-white/70">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <QuoteButton size="lg">Get Free Quote</QuoteButton>
              </Magnetic>
              <Button
                href={`tel:${company.phone}`}
                external
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:border-gold hover:text-gold"
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
