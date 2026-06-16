"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useLeadSubmit } from "./useLeadSubmit";

const STORAGE_KEY = "vyntra_exit_intent_at";
const COOLDOWN_MS = 1000 * 60 * 60 * 24; // once per 24h

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { status, error, submit } = useLeadSubmit();

  useEffect(() => {
    let shown = false;
    const last = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    if (Date.now() - last < COOLDOWN_MS) return;

    const trigger = () => {
      if (shown) return;
      shown = true;
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setOpen(true);
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    document.addEventListener("mouseout", onMouseOut);
    // Mobile fallback: there's no exit-intent, so offer after a dwell.
    const timer = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 768px)").matches) trigger();
    }, 40000);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.clearTimeout(timer);
    };
  }, []);

  async function handleSubmit() {
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.trim().length < 6) {
      return;
    }
    await submit({
      source: "exit_intent",
      name,
      email,
      phone,
      message: "Requested a callback via exit-intent offer.",
    });
  }

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Before you go" className="max-w-md">
      {status === "success" ? (
        <div className="py-4 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold-dark">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-ink">You&apos;re on the list</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink-600">
            Thanks! A Vyntra specialist will call you back shortly with a free,
            no-obligation quote.
          </p>
          <Button className="mt-5" variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      ) : (
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
            <Sparkles className="h-3.5 w-3.5" /> Free, no-obligation quote
          </span>
          <h3 className="mt-3 text-2xl font-bold text-ink">
            Before you go — let&apos;s get you a quote
          </h3>
          <p className="mt-2 text-sm text-ink-600">
            Leave your details and a Vyntra specialist will call you back within
            one business day. No pressure, no obligation.
          </p>
          <div className="mt-5 space-y-2.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-xl border border-ink/12 bg-white/80 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="email"
              className="w-full rounded-xl border border-ink/12 bg-white/80 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-xl border border-ink/12 bg-white/80 px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="button" onClick={handleSubmit} disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>Request my callback</>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full pt-1 text-center text-xs text-ink-600/70 underline-offset-2 hover:underline"
            >
              No thanks, I&apos;ll keep browsing
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
