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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

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
      .map((m) => ({
        role: m.role,
        content: m.content
          .replace(/\[CONTACT:[^\]]*\]/g, "")
          .replace(/\[SHOW_QUOTE_BUTTON\]/g, "")
          .trim(),
      }));

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, history }),
        signal: controller.signal,
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

      // Flush any remaining buffered bytes in the decoder
      const tail = decoder.decode();
      if (tail) {
        accumulated += tail;
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
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
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
          aria-label="Message input"
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
