import {
  ClipboardCheck,
  FileText,
  Inbox,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { MonoReadout, VerifiedBadge } from "@/components/ui/os";
import { BeforeAfter } from "@/components/record/BeforeAfter";
import { getRecord, featuredRecordId } from "@/data/records";
import { people } from "@/data/people";

const record = getRecord(featuredRecordId)!;
const contractor = people.find(
  (p) => p.kind === "contractor" && p.recordId === featuredRecordId,
);

const STAGES = [
  "The enquiry",
  "Dispatch",
  "On site",
  "Verification",
  "The record",
] as const;

/**
 * THE RECORD — the centrepiece. Phase 1 renders the spec's static "document"
 * state: one real job, enquiry → archive, with a persistent Record Spine. The
 * pinned GSAP choreography and tactile micro-interactions arrive in Phase 2.
 */
export function RecordWalkthrough() {
  return (
    <section id="the-record" className="bg-travertine py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={`Record · ${record.id}`}
          title="One job, from enquiry to permanent archive."
          subtitle="This is how every Vyntra job works. Follow one real record — scoped, dispatched, delivered, verified and filed — so nothing is ever forgotten."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* The Record Spine — sticky on desktop */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center justify-between">
                <MonoReadout className="text-brass">{record.id}</MonoReadout>
                <VerifiedBadge />
              </div>
              <p className="mt-2 text-sm text-ink-600">
                {record.serviceName} · {record.suburb}
              </p>
              <ol className="mt-5 space-y-1">
                {STAGES.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 py-1.5">
                    <span className="mono-readout tabular text-[0.65rem] text-ink-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-4 bg-line" />
                    <span className="text-sm text-ink">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* The acts */}
          <div className="space-y-5">
            {/* Act I — The enquiry */}
            <Act
              index={1}
              icon={<Inbox className="h-4 w-4" />}
              title="The enquiry"
              body="A request arrives and is captured instantly — nothing written on a notepad, nothing lost. It becomes a record the moment it lands."
            >
              <OsCard>
                <MonoReadout className="text-ondark-400">
                  Lead received · 14:32
                </MonoReadout>
                <p className="mt-3 font-sans text-ondark">
                  {record.serviceName} — {record.suburb}
                </p>
                <p className="mt-1 text-sm text-ondark-600">
                  Routed to dispatch in Vyntra OS.
                </p>
              </OsCard>
            </Act>

            {/* Act II — Dispatch */}
            <Act
              index={2}
              icon={<UserCheck className="h-4 w-4" />}
              title="Dispatch"
              body="The record is created and the right contractor is assigned — a vetted, accountable person, not a stranger with a key."
            >
              <OsCard>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full">
                    <Photo
                      src={contractor?.image}
                      alt={contractor?.name ?? "Vyntra contractor"}
                      ratio="square"
                      label=" "
                    />
                  </div>
                  <div>
                    <p className="font-sans text-ondark">
                      {contractor?.name ?? "Vyntra contractor"}
                    </p>
                    <p className="text-sm text-ondark-600">Assigned</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {(contractor?.credentials ?? []).map((c) => (
                    <MonoReadout key={c} className="text-brass-soft">
                      {c}
                    </MonoReadout>
                  ))}
                </div>
              </OsCard>
            </Act>

            {/* Act III — On site */}
            <Act
              index={3}
              icon={<ClipboardCheck className="h-4 w-4" />}
              title="On site"
              body="Live status, a documented scope, and before-photos captured against the real surfaces — the work and its record moving together."
            >
              <div className="overflow-hidden rounded-xl">
                <Photo
                  src=""
                  alt="Vyntra contractor on site"
                  ratio="wide"
                  label="On-site · the work in progress"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                <MonoReadout className="text-ink-400">En route · 06:58</MonoReadout>
                <MonoReadout className="text-ink-400">Arrived · 07:12</MonoReadout>
                <MonoReadout className="text-ink-400">
                  In progress · 07:20
                </MonoReadout>
              </div>
            </Act>

            {/* Act IV — Verification (the peak) */}
            <Act
              index={4}
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Verification"
              body="After-photos are matched to the before, the quality checklist is completed, and the job is verified. It was done — and it can be proven."
              peak
            >
              <BeforeAfter
                beforeSrc={record.beforeImage}
                afterSrc={record.afterImage}
                alt={`${record.serviceName}, ${record.suburb}`}
              />
              <div className="mt-4 flex items-center justify-between rounded-xl border border-verified/30 bg-verified/[0.06] px-4 py-3">
                <span className="text-sm text-ink">
                  Quality assurance complete
                </span>
                <VerifiedBadge />
              </div>
            </Act>

            {/* Act V — The record */}
            <Act
              index={5}
              icon={<FileText className="h-4 w-4" />}
              title="The record"
              body="A client report is generated, the invoice issued, and the job archived into the property's permanent history. Nothing forgotten. Everything accounted for."
            >
              <OsCard>
                <div className="flex items-center justify-between">
                  <MonoReadout className="text-ondark-400">
                    {record.id} · Report
                  </MonoReadout>
                  <MonoReadout className="text-ondark-400">Archived</MonoReadout>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ondark-600">
                  {record.summary}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <VerifiedBadge />
                  <span className="text-sm text-ondark-400">
                    · Filed to property history
                  </span>
                </div>
              </OsCard>
            </Act>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Act({
  index,
  icon,
  title,
  body,
  peak,
  children,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  peak?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <article className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-graphite text-brass">
            {icon}
          </span>
          <MonoReadout className="text-ink-400">
            Stage {String(index).padStart(2, "0")}
          </MonoReadout>
          {peak && <VerifiedBadge className="ml-auto" />}
        </div>
        <h3 className="mt-4 font-serif text-2xl font-medium tracking-tight text-ink">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-ink-600">{body}</p>
        <div className="mt-6">{children}</div>
      </article>
    </Reveal>
  );
}

/** A cool Vyntra OS glass artifact (the digital layer). */
function OsCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-graphite p-5">{children}</div>;
}
