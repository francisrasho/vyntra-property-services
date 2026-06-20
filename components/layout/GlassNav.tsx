"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "glass fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
          scrolled ? "shadow-[var(--shadow-glass)]" : "shadow-none",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            aria-label="Vyntra Property Services — home"
            className="inline-flex shrink-0 items-center rounded-xl bg-ink px-3 py-1.5 ring-1 ring-gold/20"
          >
            <Image
              src="/logo-full.svg"
              alt="Vyntra Property Services"
              width={1536}
              height={1024}
              priority
              unoptimized
              className="h-12 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2">
            <QuoteButton size="sm" className="hidden sm:inline-flex">
              Get Quote
            </QuoteButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
