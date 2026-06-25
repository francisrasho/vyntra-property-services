import { stats } from "@/data/stats";
import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

export function Stats() {
  return (
    <section className="bg-ink py-16 border-t border-white/[0.06]">
      <Container>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <TiltCard intensity={6} className="h-full rounded-2xl">
                <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 text-center backdrop-blur-sm">
                  <dt className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {s.value !== null ? (
                      <AnimatedCounter
                        value={s.value}
                        prefix={s.prefix}
                        suffix={s.suffix}
                        decimals={s.decimals}
                      />
                    ) : (
                      <span className="text-gold">{s.display}</span>
                    )}
                  </dt>
                  <dd className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/50">
                    {s.label}
                  </dd>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
