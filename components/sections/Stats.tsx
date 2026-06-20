import { stats } from "@/data/stats";
import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="bg-ink py-14 border-t border-white/[0.06]">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
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
                <dd className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/50">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
