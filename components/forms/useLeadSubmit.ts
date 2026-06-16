"use client";

import { useCallback, useState } from "react";

export type LeadSource =
  | "quote_form"
  | "contact_form"
  | "instant_estimate"
  | "exit_intent";

export interface LeadPayload {
  source: LeadSource;
  name: string;
  email: string;
  phone: string;
  service?: string;
  propertyType?: string;
  budget?: string;
  suburb?: string;
  message?: string;
  preferredContact?: "phone" | "email";
  estimateLow?: number | null;
  estimateHigh?: number | null;
  meta?: Record<string, unknown>;
}

type Status = "idle" | "submitting" | "success" | "error";

/** Posts a lead to /api/lead and tracks submission status for the UI. */
export function useLeadSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (payload: LeadPayload) => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError("Something went wrong. Please try again or call us directly.");
        return false;
      }
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { status, error, submit, reset };
}
