import { stats } from "@/data/stats";
import { Container } from "@/components/ui/Container";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";

export function Stats() {
  return (
    <section className="relative z-20 -mt-16">
      <Container>
        <Reveal>
          <div className="glass grid grid-cols-2 gap-6 rounded-3xl px-6 py-8 shadow-[var(--shadow-glass)] md:grid-cols-4 md:px-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {s.value !== null ? (
                    <AnimatedCounter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      decimals={s.decimals}
                    />
                  ) : (
                    <span className="text-gold-dark">{s.display}</span>
                  )}
                </div>
                <div className="mt-1.5 text-sm text-ink-600">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
