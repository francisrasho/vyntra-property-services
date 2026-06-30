import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/os";

/** Dark, premium interior-page header. Top padding clears the fixed nav. */
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
    <section className="relative isolate overflow-hidden bg-graphite pb-16 pt-32 text-ondark">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[42rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(198,162,104,0.14),transparent_65%)]" />
      <Container className="relative z-10">
        {eyebrow && <Eyebrow tone="ondark">{eyebrow}</Eyebrow>}
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ondark-600">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
