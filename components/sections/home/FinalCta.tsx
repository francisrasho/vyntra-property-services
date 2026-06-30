import { PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { MonoReadout } from "@/components/ui/os";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { company } from "@/data/company";

/**
 * FINAL CTA — the film's last frame. A warm property at dusk, one line, one
 * door. No urgency, no popup, no second offer. The confidence of asking once.
 */
export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-ondark">
      <div className="absolute inset-0">
        <Photo
          src=""
          alt="A cared-for Sydney property at dusk"
          ratio="wide"
          label="Closing · property at dusk"
          className="!aspect-auto h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(198,162,104,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-graphite/80" />
      </div>

      <Container className="relative z-10 py-28 text-center">
        <MonoReadout className="text-brass-soft">
          Your property, on the record
        </MonoReadout>
        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-tight text-ondark text-balance sm:text-5xl">
          Let&apos;s put your property on the record.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
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
      </Container>
    </section>
  );
}
