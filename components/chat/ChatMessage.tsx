"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { useQuoteModal } from "@/components/forms/QuoteModalProvider";
import { cn } from "@/lib/cn";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = memo(function ChatMessage({
  message,
}: {
  message: Message;
}) {
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
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-gold text-ink rounded-br-sm whitespace-pre-wrap"
              : "bg-white border border-ink/10 text-ink rounded-bl-sm shadow-sm prose prose-sm prose-neutral max-w-none"
          )}
        >
          {displayText ? (
            isUser ? (
              displayText
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-1 ml-4 list-disc space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-1 ml-4 list-decimal space-y-0.5">{children}</ol>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {displayText}
              </ReactMarkdown>
            )
          ) : (
            <span className="opacity-0">·</span>
          )}
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
});
