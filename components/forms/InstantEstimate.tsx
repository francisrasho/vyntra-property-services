"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  estimateRange,
  type Frequency,
  type PropertySize,
} from "@/lib/estimate";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { Choice, inputBase } from "./fields";
import { useLeadSubmit } from "./useLeadSubmit";

const sizes: { value: PropertySize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const freqs: { value: Frequency; label: string }[] = [
  { value: "once", label: "One-off" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

export function InstantEstimate() {
  const [service, setService] = useState(services[0].slug);
  const [size, setSize] = useState<PropertySize>("medium");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { status, error, submit } = useLeadSubmit();

  const range = useMemo(
    () => estimateRange(service, size, frequency),
    [service, size, frequency],
  );

  async function handleSend() {
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.trim().length < 6) {
      return;
    }
    const serviceName = services.find((s) => s.slug === service)?.name ?? service;
    await submit({
      source: "instant_estimate",
      name,
      email,
      phone,
      service: serviceName,
      estimateLow: range.low,
      estimateHigh: range.high,
      meta: { size, frequency },
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputBase + " appearance-none"}
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Property size</span>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => (
              <Choice key={s.value} selected={size === s.value} onClick={() => setSize(s.value)}>
                {s.label}
              </Choice>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Frequency</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {freqs.map((f) => (
              <Choice key={f.value} selected={frequency === f.value} onClick={() => setFrequency(f.value)}>
                {f.label}
              </Choice>
            ))}
          </div>
        </div>
      </div>

      {/* Result + capture */}
      <div className="rounded-2xl bg-ink p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
          Indicative estimate
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          ${range.low.toLocaleString("en-AU")}{" "}
          <span className="text-white/50">–</span> $
          {range.high.toLocaleString("en-AU")}
        </p>
        <p className="mt-1 text-sm text-white/60">
          per visit · indicative only — your exact quote is free.
        </p>

        {status === "success" ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-white/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
            <p className="text-sm text-white/85">
              Sent! We&apos;ll be in touch with your tailored quote shortly.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-2.5">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-lg border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Button
              type="button"
              onClick={handleSend}
              disabled={status === "submitting"}
              className="w-full"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>Email me this estimate</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
