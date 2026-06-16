import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schema";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

/** Receives every website lead. Validates, drops spam (honeypot), then either
 *  inserts into the Vyntra OS Supabase or logs it (demo mode). */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot tripped → pretend success, drop silently.
  if (data.company_website && data.company_website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const sink = process.env.LEAD_SINK ?? "log";

  if (sink === "supabase") {
    const supabase = getServiceClient();
    if (supabase) {
      const { error } = await supabase.from("website_leads").insert({
        source: data.source,
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        property_type: data.propertyType ?? null,
        budget: data.budget,
        suburb: data.suburb,
        message: data.message,
        preferred_contact: data.preferredContact,
        estimate_low: data.estimateLow ?? null,
        estimate_high: data.estimateHigh ?? null,
        meta: data.meta ?? {},
      });
      if (error) {
        console.error("[lead] supabase insert failed:", error.message);
        return NextResponse.json(
          { ok: false, error: "Could not save your request. Please call us." },
          { status: 500 },
        );
      }
    } else {
      console.warn("[lead] LEAD_SINK=supabase but credentials are missing.");
    }
  } else {
    console.info("[lead:demo]", JSON.stringify(data));
  }

  return NextResponse.json({ ok: true });
}
