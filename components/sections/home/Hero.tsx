import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { MonoReadout, VerifiedBadge } from "@/components/ui/os";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { signalEvents } from "@/data/signal";

/**
 * THE HERO — "The Unwatched Hour", resting/equilibrium state (Phase 1).
 * The Awakening, Registration and Cursor-as-Light arrive in Phase 2; this is
 * the spec'd static state and is fully launchable on its own.
 */
export function Hero() {
  const live = signalEvents[0];

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-graphite pt-20 text-ondark">
      {/* The property — cinematic photographic plane (awaiting the shoot). */}
      <div className="absolute inset-0">
        <Photo
          src=""
          alt="A premium Sydney property at dusk"
          ratio="hero"
          label="Hero · Sydney property at blue hour"
          priority
          className="!aspect-auto h-full w-full"
          sizes="100vw"
        />
        {/* Two-light grade: cool base, one warm pool + a scrim for legibility. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(198,162,104,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-graphite/40" />
      </div>

      <Container className="relative z-10 flex min-h-[calc(100svh-5rem)] flex-col justify-center py-16">
        <div className="max-w-2xl">
          <MonoReadout className="text-brass-soft">
            Sydney · Technology-enabled property care
          </MonoReadout>

          <h1 className="mt-6 font-serif text-[2.6rem] font-medium leading-[1.04] tracking-tight text-ondark sm:text-6xl lg:text-7xl">
            Your property,
            <br />
            on the record.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ondark-600">
            Every clean, repair and inspection — scoped, checklisted and
            photo-verified. Documented, accountable, and powered by Vyntra OS.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <QuoteButton size="lg" variant="ondark">
              Open a property
            </QuoteButton>
            <a
              href="#the-record"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-ondark-600 transition-colors hover:text-ondark"
            >
              See how it works
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* The live operating signal — proof the system is running, in the Hero. */}
        <div className="mt-14 w-full max-w-xl">
          <div className="os-glass flex items-center gap-3 rounded-xl px-4 py-3 sm:gap-5">
            <span
              className="breath h-2 w-2 shrink-0 rounded-full bg-verified"
              aria-hidden
            />
            <MonoReadout className="tabular shrink-0 text-ondark-400">
              {live.time}
            </MonoReadout>
            <MonoReadout className="shrink-0 text-brass-soft">
              {live.id}
            </MonoReadout>
            <span className="flex-1 truncate text-sm text-ondark-600">
              {live.suburb} · {live.action}
            </span>
            <VerifiedBadge />
          </div>
        </div>
      </Container>
    </section>
  );
}
