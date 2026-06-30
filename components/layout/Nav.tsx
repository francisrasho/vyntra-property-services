"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { primaryNav } from "./nav";
import { QuoteButton } from "@/components/forms/QuoteButton";

/** The Vyntra wordmark — mono "OS" voice with a live status dot (the Breath). */
function Wordmark({ tone = "ink" }: { tone?: "ink" | "ondark" }) {
  return (
    <Link
      href="/"
      aria-label="Vyntra Property Services — home"
      className="inline-flex items-center gap-2.5"
    >
      <span
        className="breath inline-block h-1.5 w-1.5 rounded-full bg-brass"
        aria-hidden
      />
      <span
        className={cn(
          "font-mono text-base font-medium uppercase tracking-[0.3em]",
          tone === "ondark" ? "text-ondark" : "text-ink",
        )}
      >
        Vyntra
      </span>
    </Link>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-travertine/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  active
                    ? "text-ink"
                    : "text-ink-600 hover:text-ink",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <QuoteButton size="md" className="hidden sm:inline-flex">
            Open a property
          </QuoteButton>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-graphite/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-graphite/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-graphite px-6 py-5 transition-transform duration-300 ease-[var(--ease-settle)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Wordmark tone="ondark" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full text-ondark transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
            {primaryNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-line-dark py-4 font-serif text-2xl text-ondark"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <QuoteButton size="lg" variant="ondark" className="w-full">
              Open a property
            </QuoteButton>
          </div>
        </div>
      </div>
    </header>
  );
}
