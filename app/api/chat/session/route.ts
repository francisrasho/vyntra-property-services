import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const SESSION_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { sessionId, name, email, phone } = body ?? {};

  if (typeof sessionId !== "string" || !SESSION_UUID_RE.test(sessionId)) {
    return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  // Validate field lengths
  if (
    (name !== undefined && name !== null && String(name).length > 200) ||
    (email !== undefined && email !== null && String(email).length > 200) ||
    (phone !== undefined && phone !== null && String(phone).length > 50)
  ) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    // Demo mode — no credentials configured, degrade safely
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("chat_sessions")
    .update({
      name: name ?? null,
      email: email ?? null,
      phone: phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    console.error("[chat/session] update failed:", error.message);
    return NextResponse.json(
      { error: "Could not update session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
