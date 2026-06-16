import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Particles } from "@/components/ui/Particles";

/** Dark, premium page header for interior pages. Its top padding clears the
 *  fixed glass nav. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 text-white">
      <Particles className="opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-6 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-2xl" />
      <Container className="relative z-10">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-soft">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/70">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
