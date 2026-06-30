import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MonoReadout } from "@/components/ui/os";
import { LedgerLine } from "@/components/record/LedgerLine";
import { signalEvents, signalTelemetry } from "@/data/signal";

const telemetry = [
  { label: "Records", value: signalTelemetry.recordsTotal.toLocaleString() },
  { label: "Verified", value: `${signalTelemetry.verifiedPct}%` },
  { label: "Active sites", value: String(signalTelemetry.activeSites) },
  { label: "Avg response", value: signalTelemetry.avgResponse },
];

/**
 * THE LIVE SIGNAL — operating proof. Graphite "control room": telemetry strip
 * + a settled ledger of recent operating events. (Streaming = Phase 2.)
 */
export function LiveSignal() {
  return (
    <section className="bg-graphite py-24 text-ondark">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Framing + telemetry */}
          <div>
            <SectionHeading
              tone="ondark"
              align="left"
              eyebrow="Right now, across Sydney"
              title="The system is running."
              subtitle="Vyntra OS records every job as it happens. Not a claim — a live operating history you can read."
            />

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark">
              {telemetry.map((t) => (
                <div key={t.label} className="bg-graphite p-5">
                  <dt>
                    <MonoReadout className="text-ondark-400">
                      {t.label}
                    </MonoReadout>
                  </dt>
                  <dd className="tabular mt-2 font-serif text-3xl text-ondark">
                    {t.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4">
              <MonoReadout className="text-ondark-400">
                Operating since {signalTelemetry.since}
              </MonoReadout>
            </p>
          </div>

          {/* The signal ledger */}
          <div className="os-glass rounded-2xl p-5 sm:p-7">
            <div className="mb-2 flex items-center justify-between">
              <MonoReadout className="text-ondark-400">
                Live signal
              </MonoReadout>
              <span className="flex items-center gap-2">
                <span
                  className="breath h-1.5 w-1.5 rounded-full bg-verified"
                  aria-hidden
                />
                <MonoReadout className="text-ondark-400">Operational</MonoReadout>
              </span>
            </div>
            <div>
              {signalEvents.map((e) => (
                <LedgerLine
                  key={e.id}
                  lead={e.time}
                  id={e.id}
                  suburb={e.suburb}
                  action={e.action}
                  status={e.status}
                  tone="dark"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
