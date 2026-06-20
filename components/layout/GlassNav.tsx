"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
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

  return (
    <>
      <header
        className={cn(
          "glass fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
          scrolled ? "shadow-[var(--shadow-glass)]" : "shadow-none",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {primaryNav.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active ? "text-gold-dark" : "text-ink-600 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <QuoteButton size="sm" className="hidden sm:inline-flex">
              Get Quote
            </QuoteButton>
            <Link
              href="/"
              aria-label="Vyntra Property Services — home"
              className="hidden items-center rounded-xl bg-ink px-3 py-1.5 ring-1 ring-gold/20 md:inline-flex"
            >
              <Image
                src="/logo-full.svg"
                alt="Vyntra Property Services"
                width={1536}
                height={1024}
                unoptimized
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
