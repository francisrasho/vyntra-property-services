# AI Chatbot — Design Spec
Date: 2026-06-20

## Overview

A floating AI chat widget powered by Claude (Anthropic) embedded on the Vyntra Property Services website. The widget lets visitors ask questions about Vyntra's services and naturally collects their contact details (name, email, mobile) mid-conversation. All sessions and messages are persisted to Supabase.

---

## User Experience

### Widget
- Floating bubble anchored **bottom-right**, matching the existing FloatingQuoteButton placement (ensure no overlap — chatbot sits above it)
- Avatar: `/logo-mark.svg` on a dark `bg-ink` rounded square with gold ring border, matching the nav logo style
- Clicking the bubble opens the chat panel; clicking again or the ✕ closes it

### Conversation flow — "Chat first, collect later"
- Panel opens with a welcome message from Vyntra AI
- User can type freely — no gate or form before chatting
- At a natural point in the conversation, the AI asks for name, email, and mobile (e.g. "To make sure the team can follow up with you, could I grab your name and contact details?")
- Once the user provides their details, the frontend sends them to the API which upserts them into `chat_sessions`

### Quote button
- When Claude determines a quote is appropriate (user asks about pricing, describes a job, asks how to book, or signals readiness), it appends `[SHOW_QUOTE_BUTTON]` to its response text
- The frontend strips this marker and renders a gold "Get a Free Quote" button below that message bubble
- Clicking the button opens the existing `QuoteModalProvider` modal (no duplicate form)

---

## Architecture

### Components

| File | Purpose |
|------|---------|
| `components/chat/ChatWidget.tsx` | Root client component — mounts bubble + panel, manages open/close state |
| `components/chat/ChatPanel.tsx` | The chat panel — message list, input bar, streaming state |
| `components/chat/ChatMessage.tsx` | Single message bubble — handles `[SHOW_QUOTE_BUTTON]` marker, renders quote button |

`ChatWidget` is added to `app/layout.tsx` alongside the existing `FloatingQuoteButton` and `ExitIntentPopup`.

### API Route

**`app/api/chat/route.ts`** (POST, streaming)

Request body:
```ts
{
  sessionId: string;       // UUID, created client-side on first message
  message: string;         // user's message text
  history: { role: "user" | "assistant"; content: string }[];
}
```

Response: streaming text (`text/event-stream` or `ReadableStream`) so Claude's response appears word-by-word.

Responsibilities:
1. Validate input (non-empty message, valid sessionId format)
2. Upsert a row in `chat_sessions` for the sessionId (creates if new)
3. Call Claude API with system prompt + conversation history + new message
4. Stream Claude's response back to the client
5. After stream completes, save both the user message and full assistant response to `chat_messages`

If Supabase credentials are missing, the route still works (chat functions, messages just aren't persisted — same degraded-safe pattern as `getServiceClient()`).

### Session management (client-side)
- On first user message, generate a UUID (`crypto.randomUUID()`) and store in `sessionStorage`
- Pass `sessionId` with every request
- Conversation history kept in React state (not re-fetched from DB — session is in-memory per tab)

### Contact info extraction
- When the AI collects name/email/phone from the user, the frontend sends a PATCH to `/api/chat/session` with `{ sessionId, name, email, phone }`
- The API upserts these fields into the `chat_sessions` row
- Detection: after each assistant message, check if the preceding user message(s) contain an email pattern and/or phone pattern, and if the AI's message acknowledges receiving them — then fire the PATCH
- Alternatively, the system prompt instructs Claude to append `[CONTACT:name|email|phone]` when it has confirmed all three fields; the frontend parses and strips this marker

**Decision:** Use the `[CONTACT:name|email|phone]` marker approach — more reliable than regex heuristics on raw chat.

---

## Supabase Schema

```sql
-- Run as a migration
create table if not exists chat_sessions (
  id         uuid primary key,
  name       text,
  email      text,
  phone      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists chat_messages (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz default now()
);

create index if not exists chat_messages_session_id_idx on chat_messages(session_id);
```

RLS: tables are private (service-role key only, accessed via the API route — never from the client directly).

---

## Claude System Prompt

The system prompt establishes the AI's identity, knowledge, and hard guardrails.

### Identity
> You are Vyntra's AI property assistant. Vyntra Property Services is a Sydney-based company offering commercial cleaning, strata cleaning, office cleaning, and property maintenance/handyman services.

### Knowledge scope
- Services offered: commercial cleaning, strata cleaning, office cleaning, end-of-lease cleaning, handyman and property maintenance
- Service area: Sydney metro
- For specific service details, direct users to the website or quote form

### Hard guardrails (never violate)
1. **No pricing** — never quote a price, rate, or cost estimate. Always say pricing depends on scope and direct to the quote form.
2. **No timeline commitments** — never promise when a job can start or how long it will take.
3. **No outcome guarantees** — never say "we'll fix it" or "guaranteed results."
4. **No liability** — for complaints, damage, or incidents, say "please contact our team directly" and do not admit fault.
5. **No legal advice** — for insurance, compliance, WHS, or contract questions, direct to the team.
6. **Stay in scope** — only discuss Vyntra's services. Do not recommend competitors.
7. **No personal opinions** — don't comment on pricing fairness, competitor quality, or industry controversies.

### Contact collection
When the conversation reaches a natural point (user asks about booking, pricing, or follow-up), ask for name, email, and mobile. Once all three are confirmed, append `[CONTACT:Full Name|email@example.com|0400000000]` to the response.

### Quote button
When the user asks about pricing, describes a specific job, asks how to book, or signals readiness to proceed, append `[SHOW_QUOTE_BUTTON]` at the end of your response text.

---

## Environment Variables Required

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=...               # already present
SUPABASE_SERVICE_ROLE_KEY=...  # already present
```

---

## File Checklist

- [ ] `components/chat/ChatWidget.tsx`
- [ ] `components/chat/ChatPanel.tsx`
- [ ] `components/chat/ChatMessage.tsx`
- [ ] `app/api/chat/route.ts`
- [ ] `app/api/chat/session/route.ts`
- [ ] Supabase migration (SQL)
- [ ] `app/layout.tsx` — add `<ChatWidget />`
- [ ] `.env.local` — add `ANTHROPIC_API_KEY`
