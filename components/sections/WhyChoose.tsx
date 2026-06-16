import { whyChoose } from "@/data/whyChoose";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Particles } from "@/components/ui/Particles";
import { Icon } from "@/components/ui/icon";

export function WhyChoose() {
  return (
    <section id="why" className="relative overflow-hidden bg-ink py-24 text-white">
      <Particles className="opacity-70" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-gold/[0.07] blur-2xl" />

      <Container className="relative z-10">
        <SectionHeading
          invert
          eyebrow="Why Vyntra"
          title="The difference is in how we work"
          subtitle="Reliability and professionalism, powered by modern technology and a genuine commitment to long-term partnerships."
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.04}>
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-white/5 text-gold">
                  <Icon name={r.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {r.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
