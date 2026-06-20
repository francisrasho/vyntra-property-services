import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const SESSION_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { sessionId, name, email, phone } = body ?? {};

  if (!sessionId || !SESSION_UUID_RE.test(String(sessionId))) {
    return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
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
