"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("vyntra_chat_sid");
      if (stored) {
        setSessionId(stored);
      } else {
        const id =
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        try {
          sessionStorage.setItem("vyntra_chat_sid", id);
        } catch {
          // sessionStorage unavailable (sandboxed iframe, private mode quota)
        }
        setSessionId(id);
      }
    } catch {
      // sessionStorage blocked; generate ephemeral session id
      setSessionId(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Focus the close button inside the header on open
      const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close chat"]');
      closeBtn?.focus();
    } else {
      bubbleRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && sessionId && (
          <motion.div
            key="chat-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-panel-title"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden",
              "w-[calc(100vw-2rem)] sm:w-96",
              "h-[min(520px,calc(100vh-8rem))]",
              "bottom-[8.5rem] right-4 md:bottom-[8.5rem] md:right-6",
              "rounded-2xl border border-ink/10 bg-bg shadow-[var(--shadow-glass)]"
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
                <p id="chat-panel-title" className="text-sm font-semibold text-white">
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
        ref={bubbleRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Chat with Vyntra"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "fixed z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "border-2 border-gold bg-ink shadow-[var(--shadow-glow)]",
          "transition-transform duration-200 hover:scale-105",
          "bottom-20 right-4 md:bottom-20 md:right-6"
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
