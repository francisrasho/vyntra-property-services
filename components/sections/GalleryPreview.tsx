import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gallery } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function GalleryPreview() {
  const items = gallery.slice(0, 6);

  return (
    <section className="bg-bg py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Our work"
            title="Results you can see"
            subtitle="A glimpse of the spaces we keep immaculate across Sydney."
            className="max-w-xl"
          />
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-gold-dark hover:text-ink"
          >
            View full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.04}>
              <Link
                href="/gallery"
                className="group relative block aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-4 right-4 translate-y-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
