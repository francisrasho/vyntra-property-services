"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";
import { primaryNav } from "./nav";
import { QuoteButton } from "@/components/forms/QuoteButton";

export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only the homepage opens over a dark cinematic hero, so it gets a fully
  // transparent bar with light text at the very top that resolves into the
  // frosted glass bar on scroll. Every other page keeps the glass bar as-is.
  const overHero = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-out",
          overHero ? "bg-transparent" : "glass",
          scrolled ? "shadow-[var(--shadow-glass)]" : "shadow-none",
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            aria-label="Vyntra Property Services — home"
            className="inline-flex shrink-0 items-center gap-3"
          >
            <Image
              src="/logo-mark.svg"
              alt=""
              width={810}
              height={554}
              priority
              unoptimized
              className="h-11 w-auto"
            />
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  "text-2xl font-bold tracking-tight transition-colors duration-500",
                  overHero ? "text-white" : "text-ink",
                )}
              >
                VYNTRA
              </span>
              <span
                className={cn(
                  "mt-1 text-[11px] font-semibold uppercase tracking-[0.26em] transition-colors duration-500",
                  overHero ? "text-gold-soft" : "text-gold-dark",
                )}
              >
                Property Services
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300",
                    overHero
                      ? active
                        ? "bg-white/10 text-gold-soft"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-ink/5 text-gold-dark"
                        : "text-ink-600 hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <QuoteButton size="md" className="glow-pulse hidden sm:inline-flex">
              Get Quote
            </QuoteButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full transition-colors duration-300",
                overHero
                  ? "text-white hover:bg-white/10"
                  : "text-ink hover:bg-ink/5",
              )}
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
