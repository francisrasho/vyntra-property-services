import Anthropic from "@anthropic-ai/sdk";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SESSION_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SYSTEM_PROMPT = `You are Vyntra's AI property assistant. Vyntra Property Services is a Sydney-based company offering commercial cleaning, strata cleaning, office cleaning, end-of-lease cleaning, and property maintenance/handyman services. Your service area is Sydney metro.

RULES — never violate these:
1. No pricing: never quote a price, rate, or cost estimate. Always say pricing depends on scope and direct to the quote form.
2. No timeline commitments: never promise when a job can start or how long it will take.
3. No outcome guarantees: never say "we'll fix it" or "guaranteed results."
4. No liability: for complaints, damage, or incidents, say "please contact our team directly" and do not admit fault.
5. No legal advice: for insurance, compliance, WHS, or contract questions, direct to the team.
6. Stay in scope: only discuss Vyntra's services. Do not recommend competitors.
7. No personal opinions: don't comment on pricing fairness, competitor quality, or industry controversies.

CONTACT COLLECTION:
When the conversation reaches a natural point (user asks about booking, pricing, or follow-up), ask for their name, email address, and mobile number. Once the user has provided all three and you have confirmed them, append [CONTACT:Full Name|email@example.com|0412345678] at the very end of your response.

QUOTE BUTTON:
When the user asks about pricing, describes a specific job, asks how to book, or signals readiness to proceed, append [SHOW_QUOTE_BUTTON] at the very end of your response text (after any [CONTACT:...] marker if both apply).`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.message !== "string" ||
    !body.message.trim() ||
    typeof body.sessionId !== "string" ||
    !SESSION_UUID_RE.test(body.sessionId)
  ) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sessionId: string = body.sessionId;
  const message: string = body.message.trim();
  const history: { role: "user" | "assistant"; content: string }[] =
    Array.isArray(body.history) ? body.history : [];

  if (message.length > 2000) {
    return new Response(JSON.stringify({ error: "Message too long" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sanitizedHistory = history
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .slice(-40); // cap at 40 entries (~20 turns)

  const supabase = getServiceClient();

  // Upsert session row so foreign key constraint on chat_messages is satisfied
  if (supabase) {
    const { error: upsertErr } = await supabase
      .from("chat_sessions")
      .upsert({ id: sessionId }, { onConflict: "id" });
    if (upsertErr) {
      console.error("[chat] session upsert failed:", upsertErr.message);
    }
  }

  const messages: Anthropic.MessageParam[] = [
    ...sanitizedHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  const anthropicStream = anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const encoder = new TextEncoder();
  let fullText = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullText += text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
        return;
      }

      // Best-effort persistence after stream closes
      if (supabase && fullText) {
        const { error: insertErr } = await supabase.from("chat_messages").insert([
          { session_id: sessionId, role: "user", content: message },
          { session_id: sessionId, role: "assistant", content: fullText },
        ]);
        if (insertErr) {
          console.error("[chat] message persistence failed:", insertErr.message);
        }
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
