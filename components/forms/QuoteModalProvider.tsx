"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Modal } from "@/components/ui/Modal";
import { QuoteForm } from "./QuoteForm";

interface QuoteModalContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) {
    throw new Error("useQuoteModal must be used within a QuoteModalProvider");
  }
  return ctx;
}

/** Provides a single global "request a quote" modal, openable from anywhere. */
export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      <Modal open={isOpen} onClose={close} title="Request a free quote" className="max-w-xl">
        <QuoteForm onSuccess={close} />
      </Modal>
    </QuoteModalContext.Provider>
  );
}
