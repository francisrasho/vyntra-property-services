import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MonoReadout } from "@/components/ui/os";
import { LedgerLine } from "@/components/record/LedgerLine";
import { records } from "@/data/records";
import { signalTelemetry } from "@/data/signal";

const fmtDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("en-AU", { day: "2-digit", month: "short" })
    .toUpperCase();

/**
 * RECORDS (preview) — the archive as a register on travertine. Consistency,
 * not spectacle: a uniform ledger where every line ends in Verified.
 */
export function RecordsPreview() {
  return (
    <section className="bg-travertine py-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="The archive"
            title="Every completed job becomes a record."
            subtitle="Not a portfolio of highlights — a documented history. The consistency is the proof."
          />
          <div className="shrink-0">
            <MonoReadout className="text-ink-400">
              {signalTelemetry.recordsTotal.toLocaleString()} records ·{" "}
              {signalTelemetry.verifiedPct}% verified · since{" "}
              {signalTelemetry.since}
            </MonoReadout>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-paper p-5 sm:p-7">
          {records.slice(0, 8).map((r) => (
            <LedgerLine
              key={r.id}
              lead={fmtDate(r.date)}
              id={r.id}
              suburb={r.suburb}
              action={r.serviceName}
              status={r.status}
              tone="light"
            />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/records"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brass"
          >
            View the full archive
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
