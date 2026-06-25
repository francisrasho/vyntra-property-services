import { PlayCircle, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Testimonials({
  limit,
  showVideoPlaceholder = true,
}: {
  limit?: number;
  showVideoPlaceholder?: boolean;
} = {}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by Sydney's property professionals"
          subtitle="Property managers, strata managers and business owners rely on Vyntra to protect their assets and their reputation."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04}>
              <TiltCard intensity={7} className="h-full rounded-2xl">
                <figure className="flex h-full flex-col rounded-2xl border border-ink/[0.08] bg-surface p-7 shadow-sm transition-colors duration-300 hover:border-gold/30 hover:shadow-[0_22px_44px_-16px_rgba(212,175,55,0.25)]">
                  <div className="flex gap-0.5 text-gold" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-sm font-semibold text-gold">
                      {t.initials}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.name}</span>
                      <span className="block text-xs text-ink-600">
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </TiltCard>
            </Reveal>
          ))}

          {showVideoPlaceholder && (
            <Reveal delay={0.12}>
              <div className="flex h-full min-h-[230px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-ink/[0.02] p-7 text-center">
                <PlayCircle className="h-10 w-10 text-gold-dark" />
                <p className="mt-3 text-sm font-semibold text-ink">Video testimonials</p>
                <p className="mt-1 text-xs text-ink-600">
                  Coming soon — hear from our clients in their own words.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
