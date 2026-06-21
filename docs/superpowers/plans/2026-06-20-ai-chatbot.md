# AI Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a floating AI chat widget powered by Claude that lets visitors ask questions about Vyntra's services and naturally collects their contact details mid-conversation.

**Architecture:** A `ChatWidget` client component (bubble + panel) mounts in `app/layout.tsx`. It posts messages to `/api/chat` which streams Claude's responses back chunk-by-chunk. A separate `/api/chat/session` PATCH route upserts contact info when Claude signals it has collected all three fields. All sessions and messages are persisted to Supabase (two new tables).

**Tech Stack:** Next.js 15 App Router, `@anthropic-ai/sdk`, Supabase (service-role), framer-motion (already installed), Tailwind CSS 4, lucide-react.

---

### Task 1: Install Anthropic SDK and add env var

**Goal:** Add `@anthropic-ai/sdk` to dependencies and add `ANTHROPIC_API_KEY` placeholder to `.env.local` so the API route can import and use it.

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `.env.local`

**Acceptance Criteria:**
- [ ] `@anthropic-ai/sdk` appears in `package.json` dependencies
- [ ] `.env.local` has an `ANTHROPIC_API_KEY=` line (value can be a placeholder for now)
- [ ] `npm run typecheck` exits 0

**Verify:** `npm run typecheck` → no errors

**Steps:**

- [ ] **Step 1: Install the Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

Expected output: `added N packages` with `@anthropic-ai/sdk` listed.

- [ ] **Step 2: Add the env var to `.env.local`**

Append to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-REPLACE_WITH_REAL_KEY
```

- [ ] **Step 3: Verify types compile**

```bash
npm run typecheck
```

Expected: exits 0 with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @anthropic-ai/sdk dependency"
```

---

### Task 2: Supabase migration — chat tables

**Goal:** Create `chat_sessions` and `chat_messages` tables in Supabase so the API route can persist conversation data.

**Files:**
- Create: `supabase/migrations/20260620000000_chat_tables.sql`

**Acceptance Criteria:**
- [ ] `supabase/migrations/20260620000000_chat_tables.sql` exists with correct schema
- [ ] Both tables have been applied in Supabase (verify via Supabase dashboard → Table Editor)

**Verify:** Supabase dashboard shows `chat_sessions` and `chat_messages` tables under Table Editor.

**Steps:**

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260620000000_chat_tables.sql` with:

```sql
-- chat_sessions: one row per browser tab session
create table if not exists chat_sessions (
  id         uuid primary key,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- chat_messages: all messages for a session
create table if not exists chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

create index if not exists chat_messages_session_id_idx
  on chat_messages(session_id);
```

- [ ] **Step 2: Run the migration in Supabase**

Open the Supabase dashboard → SQL Editor → paste the SQL above → Run.

Alternatively, if the Supabase CLI is configured:
```bash
supabase db push
```

- [ ] **Step 3: Commit the migration file**

```bash
git add supabase/migrations/20260620000000_chat_tables.sql
git commit -m "feat: add chat_sessions and chat_messages tables"
```

---

### Task 3: Chat streaming API route

**Goal:** Create `app/api/chat/route.ts` — a POST handler that validates input, upserts a session row, calls Claude with a branded system prompt, streams the response back to the client, and persists both messages after the stream completes.

**Files:**
- Create: `app/api/chat/route.ts`

**Acceptance Criteria:**
- [ ] POST to `/api/chat` with valid body returns a streaming plain-text response
- [ ] Invalid body (missing `message` or invalid `sessionId`) returns 400
- [ ] `[SHOW_QUOTE_BUTTON]` and `[CONTACT:...]` markers are passed through in the stream (frontend handles stripping)
- [ ] `npm run typecheck` exits 0

**Verify:** `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"sessionId":"00000000-0000-0000-0000-000000000001","message":"Hi","history":[]}' --no-buffer` → streams text back

**Steps:**

- [ ] **Step 1: Create the route file**

Create `app/api/chat/route.ts`:

```ts
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

  const supabase = getServiceClient();

  // Upsert session row so foreign key constraint on chat_messages is satisfied
  if (supabase) {
    await supabase
      .from("chat_sessions")
      .upsert({ id: sessionId }, { onConflict: "id" });
  }

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
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
        for await (const text of anthropicStream.textStream) {
          fullText += text;
          controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }

      // Best-effort persistence after stream closes
      if (supabase && fullText) {
        await supabase.from("chat_messages").insert([
          { session_id: sessionId, role: "user", content: message },
          { session_id: sessionId, role: "assistant", content: fullText },
        ]);
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
```

- [ ] **Step 2: Verify types**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: add streaming /api/chat route with Claude integration"
```

---

### Task 4: Session PATCH API route

**Goal:** Create `app/api/chat/session/route.ts` — a PATCH handler that upserts `name`, `email`, and `phone` into the `chat_sessions` row identified by `sessionId`.

**Files:**
- Create: `app/api/chat/session/route.ts`

**Acceptance Criteria:**
- [ ] PATCH with valid `{ sessionId, name, email, phone }` returns `{ ok: true }`
- [ ] PATCH with invalid/missing `sessionId` returns 400
- [ ] When Supabase is unavailable (credentials missing), returns `{ ok: true }` (degrade safely)
- [ ] `npm run typecheck` exits 0

**Verify:** `npm run typecheck` → exits 0

**Steps:**

- [ ] **Step 1: Create the route file**

Create `app/api/chat/session/route.ts`:

```ts
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
```

- [ ] **Step 2: Verify types**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/api/chat/session/route.ts
git commit -m "feat: add /api/chat/session PATCH route for contact upsert"
```

---

### Task 5: ChatMessage component

**Goal:** Create `components/chat/ChatMessage.tsx` — renders a single chat bubble, strips `[SHOW_QUOTE_BUTTON]` and `[CONTACT:...]` markers from displayed text, and renders a "Get a Free Quote" button when the marker is present.

**Files:**
- Create: `components/chat/ChatMessage.tsx`

**Acceptance Criteria:**
- [ ] User messages align right with gold background
- [ ] Assistant messages align left with white background and border
- [ ] `[SHOW_QUOTE_BUTTON]` is stripped from text and replaced with a gold button below the bubble that opens the QuoteModal
- [ ] `[CONTACT:...]` marker is stripped from text (silent)
- [ ] `npm run typecheck` exits 0

**Verify:** `npm run typecheck` → exits 0

**Steps:**

- [ ] **Step 1: Create the component**

Create `components/chat/ChatMessage.tsx`:

```tsx
"use client";

import { useQuoteModal } from "@/components/forms/QuoteModalProvider";
import { cn } from "@/lib/cn";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ message }: { message: Message }) {
  const { open } = useQuoteModal();
  const isUser = message.role === "user";

  const showQuoteButton = message.content.includes("[SHOW_QUOTE_BUTTON]");
  const displayText = message.content
    .replace(/\[SHOW_QUOTE_BUTTON\]/g, "")
    .replace(/\[CONTACT:[^\]]*\]/g, "")
    .trim();

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[80%] space-y-2">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
            isUser
              ? "bg-gold text-ink rounded-br-sm"
              : "bg-white border border-ink/10 text-ink rounded-bl-sm shadow-sm"
          )}
        >
          {displayText || <span className="opacity-0">·</span>}
        </div>
        {showQuoteButton && (
          <button
            type="button"
            onClick={open}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-glow)] hover:bg-gold-soft transition-colors"
          >
            Get a Free Quote
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/chat/ChatMessage.tsx
git commit -m "feat: add ChatMessage component with quote button and marker stripping"
```

---

### Task 6: ChatPanel component

**Goal:** Create `components/chat/ChatPanel.tsx` — renders the scrollable message list, typing indicator, and input bar. Manages streaming state, sends messages to `/api/chat`, reads the stream chunk-by-chunk, and fires the PATCH when a `[CONTACT:...]` marker is detected.

**Files:**
- Create: `components/chat/ChatPanel.tsx`

**Acceptance Criteria:**
- [ ] Welcome message shown on open
- [ ] Sending a message appends user bubble and a streaming assistant bubble that fills in progressively
- [ ] Typing dots shown while streaming and content is empty
- [ ] Enter key (without Shift) submits the message
- [ ] `[CONTACT:name|email|phone]` detected after stream → fires PATCH to `/api/chat/session` (fire-and-forget)
- [ ] Network errors show a friendly error bubble
- [ ] `npm run typecheck` exits 0

**Verify:** `npm run typecheck` → exits 0

**Steps:**

- [ ] **Step 1: Create the component**

Create `components/chat/ChatPanel.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage, type Message } from "./ChatMessage";
import { cn } from "@/lib/cn";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Vyntra's AI assistant. I can help with questions about our cleaning and property maintenance services across Sydney. How can I help you today?",
};

const CONTACT_RE = /\[CONTACT:([^|]+)\|([^|]+)\|([^\]]+)\]/;

export function ChatPanel({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    // Build history excluding the static welcome message
    const history = messages
      .slice(1)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, history }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: accumulated },
        ]);
      }

      // Fire contact upsert if Claude signalled it collected all three fields
      const match = CONTACT_RE.exec(accumulated);
      if (match) {
        const [, name, email, phone] = match;
        fetch("/api/chat/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        }).catch(() => {});
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "I couldn't connect right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, messages, sessionId]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const lastIsEmpty =
    messages.length > 0 && messages[messages.length - 1].content === "";

  return (
    <div className="flex h-full flex-col">
      {/* Message list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {streaming && lastIsEmpty && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-ink/10 bg-white px-4 py-3 shadow-sm">
              <span className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-end gap-2 border-t border-ink/10 p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about our services…"
          rows={1}
          className={cn(
            "max-h-24 flex-1 resize-none rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink",
            "placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
          )}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-ink transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add components/chat/ChatPanel.tsx
git commit -m "feat: add ChatPanel with streaming, typing dots, and contact detection"
```

---

### Task 7: ChatWidget + layout integration

**Goal:** Create `components/chat/ChatWidget.tsx` — the floating bubble + animated panel shell — and wire it into `app/layout.tsx` above `<FloatingQuoteButton />`.

**Files:**
- Create: `components/chat/ChatWidget.tsx`
- Modify: `app/layout.tsx`

**Acceptance Criteria:**
- [ ] A circular bubble appears fixed bottom-right on all pages (above FloatingQuoteButton on desktop, above MobileCallBar on mobile)
- [ ] Clicking the bubble opens the chat panel with a header showing the Vyntra logo-mark
- [ ] Clicking the bubble again (or ✕) closes the panel with animation
- [ ] `sessionId` is created via `crypto.randomUUID()` on first message, stored in `sessionStorage`, and reused across panel open/close within the same tab
- [ ] `npm run typecheck` exits 0 and `npm run build` succeeds

**Verify:** `npm run build` → exits 0

**Steps:**

- [ ] **Step 1: Create `components/chat/ChatWidget.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("vyntra_chat_sid");
    if (stored) {
      setSessionId(stored);
    } else {
      const id = crypto.randomUUID();
      sessionStorage.setItem("vyntra_chat_sid", id);
      setSessionId(id);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && sessionId && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "fixed right-4 z-50 flex flex-col overflow-hidden",
              "w-[calc(100vw-2rem)] sm:w-96",
              "h-[min(520px,calc(100dvh-8rem))]",
              "bottom-[4.5rem] md:bottom-[5.5rem]",
              "rounded-2xl border border-ink/10 bg-bg shadow-[var(--shadow-glass)]",
              "md:right-6"
            )}
          >
            {/* Header */}
            <div className="flex flex-shrink-0 items-center gap-3 bg-ink px-4 py-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 border-gold bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mark.svg"
                  alt="Vyntra"
                  className="h-5 w-5"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Vyntra Assistant
                </p>
                <p className="text-xs text-white/60">Ask about our services</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-auto text-white/60 transition-colors hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat content */}
            <ChatPanel sessionId={sessionId} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating bubble */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Chat with Vyntra"}
        className={cn(
          "fixed z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "border-2 border-gold bg-ink shadow-[var(--shadow-glow)]",
          "transition-transform duration-200 hover:scale-105",
          "bottom-[4.5rem] right-4 md:bottom-6 md:right-[5.5rem]"
        )}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 text-gold" />
        )}
      </button>
    </>
  );
}
```

> **Positioning note:**
> - Mobile: bubble at `bottom-[4.5rem] right-4` — 72px above MobileCallBar (~58px tall at bottom-0)
> - Desktop: bubble at `bottom-6 right-[5.5rem]` — sits to the left of the FloatingQuoteButton at `bottom-6 right-6` (both at same vertical level, horizontally separated). The `md:right-[5.5rem]` = 88px right offset pushes it clear of the quote button (which is ~140px wide).

- [ ] **Step 2: Add ChatWidget to `app/layout.tsx`**

In `app/layout.tsx`, add the import:
```ts
import { ChatWidget } from "@/components/chat/ChatWidget";
```

Add `<ChatWidget />` directly after `<ExitIntentPopup />` inside the `<QuoteModalProvider>`:

```tsx
// Before (existing):
            <ExitIntentPopup />
          </QuoteModalProvider>

// After:
            <ExitIntentPopup />
            <ChatWidget />
          </QuoteModalProvider>
```

Full updated body of `RootLayout` after the change:
```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <JsonLd data={localBusinessSchema()} />
        <SmoothScroll>
          <ScrollProgress />
          <QuoteModalProvider>
            <GlassNav />
            <main>{children}</main>
            <Footer />
            <FloatingQuoteButton />
            <MobileCallBar />
            <ExitIntentPopup />
            <ChatWidget />
          </QuoteModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run typecheck and build**

```bash
npm run typecheck
```
Expected: exits 0.

```bash
npm run build
```
Expected: exits 0 with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/chat/ChatWidget.tsx app/layout.tsx
git commit -m "feat: add ChatWidget floating bubble and wire into layout"
```

---

## Self-Review

### Spec Coverage

| Spec requirement | Task |
|---|---|
| Floating bubble bottom-right, above FloatingQuoteButton | Task 7 |
| Avatar: logo-mark.svg on dark bg-ink with gold ring | Task 7 |
| Click bubble → open/close panel | Task 7 |
| Welcome message, no gate before chatting | Task 6 |
| Streaming word-by-word | Tasks 3, 6 |
| [SHOW_QUOTE_BUTTON] marker → render button → open QuoteModal | Tasks 3, 5 |
| [CONTACT:name\|email\|phone] marker → PATCH session | Tasks 3, 4, 6 |
| sessionId UUID via crypto.randomUUID, stored in sessionStorage | Task 7 |
| Supabase chat_sessions + chat_messages tables | Task 2 |
| Claude system prompt with identity, guardrails, contact collection | Task 3 |
| Degrade safely when Supabase unavailable | Tasks 3, 4 |
| ANTHROPIC_API_KEY env var | Task 1 |

All spec requirements covered.

### Placeholder Scan

No TBDs, TODOs, or vague steps found. All steps include complete code.

### Type Consistency

- `Message` interface defined in `ChatMessage.tsx`, imported by `ChatPanel.tsx` — consistent.
- `sessionId: string` passed from `ChatWidget` → `ChatPanel` — consistent.
- `Anthropic.MessageParam` type used for the messages array in the API route — correct.
