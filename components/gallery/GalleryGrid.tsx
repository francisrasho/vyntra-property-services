"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gallery, galleryCategories } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { Lightbox } from "./Lightbox";

export function GalleryGrid() {
  const [category, setCategory] = useState<string>("All");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered =
    category === "All"
      ? gallery
      : gallery.filter((g) => g.category === category);

  const activeIndex = filtered.findIndex((g) => g.id === activeId);

  return (
    <Container>
      <div className="flex flex-wrap justify-center gap-2">
        {galleryCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === c
                ? "bg-ink text-white"
                : "border border-ink/10 bg-surface text-ink-600 hover:border-gold/40 hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((g) => (
            <motion.button
              layout
              key={g.id}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setActiveId(g.id)}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={g.image}
                alt={g.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5 text-left text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {g.title}
                {g.before && (
                  <span className="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] text-ink">
                    Before / After
                  </span>
                )}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        items={filtered}
        index={activeIndex}
        onClose={() => setActiveId(null)}
        onNavigate={(i) => setActiveId(filtered[i]?.id ?? null)}
      />
    </Container>
  );
}
