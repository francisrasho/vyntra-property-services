"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useQuoteModal } from "./QuoteModalProvider";

type Props = Omit<ComponentProps<typeof Button>, "href" | "onClick">;

/** A Button that opens the global quote modal. */
export function QuoteButton({ children = "Get Free Quote", ...props }: Props) {
  const { open } = useQuoteModal();
  return (
    <Button onClick={open} {...props}>
      {children}
    </Button>
  );
}
