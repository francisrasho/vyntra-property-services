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
