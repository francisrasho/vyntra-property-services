import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Photo } from "@/components/ui/Photo";
import { MonoReadout } from "@/components/ui/os";
import { people } from "@/data/people";

const kindLabel: Record<string, string> = {
  client: "Verified client",
  contractor: "Vyntra contractor",
  team: "Vyntra team",
};

/**
 * VERIFIED PEOPLE — human proof, each voice anchored to a real record.
 * A calm vertical sequence — never a grid, carousel or star-rating wall.
 */
export function VerifiedPeople() {
  return (
    <section className="bg-paper py-24">
      <Container>
        <SectionHeading
          align="left"
          eyebrow="Verified people"
          title="Behind every record, real people."
          subtitle="The clients we answer to, the contractors who do the work, and the team who hold it all to standard — each tied to a documented job you can check."
        />

        <div className="mt-14 space-y-4">
          {people.map((p, i) => (
            <Reveal key={p.name + i}>
              <figure className="grid items-center gap-6 rounded-2xl border border-line bg-travertine p-6 sm:grid-cols-[160px_1fr] sm:p-8">
                <div className="w-32 overflow-hidden rounded-2xl sm:w-full">
                  <Photo
                    src={p.image}
                    alt={p.name}
                    ratio="portrait"
                    label="Portrait"
                  />
                </div>
                <div>
                  <MonoReadout className="text-brass">
                    {kindLabel[p.kind]}
                    {p.recordId ? ` · ${p.recordId}` : ""}
                  </MonoReadout>
                  <blockquote className="mt-4 font-serif text-xl leading-snug text-ink sm:text-2xl">
                    “{p.quote}”
                  </blockquote>
                  <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-sm font-medium text-ink">
                      {p.name}
                    </span>
                    <span className="text-sm text-ink-600">
                      {p.role}
                      {p.company ? `, ${p.company}` : ""}
                    </span>
                    {p.recordId && (
                      <Link
                        href={`/records#${p.recordId}`}
                        className="group ml-auto inline-flex items-center gap-1 text-sm text-brass transition-colors hover:text-ink"
                      >
                        View the record
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </figcaption>
                  {p.credentials && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                      {p.credentials.map((c) => (
                        <MonoReadout key={c} className="text-ink-400">
                          {c}
                        </MonoReadout>
                      ))}
                    </div>
                  )}
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
