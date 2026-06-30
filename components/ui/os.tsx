import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The OS "instrument" readout — monospace, uppercase, letterspaced, tabular.
 * Reserved for Vyntra OS-native elements only: IDs, timestamps, status, tags.
 */
export function MonoReadout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("mono-readout text-[0.7rem] leading-none", className)}>
      {children}
    </span>
  );
}

/** Small serif/mono eyebrow used above section headings (the Property voice). */
export function Eyebrow({
  children,
  className,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "ondark";
}) {
  return (
    <span
      className={cn(
        "mono-readout text-[0.7rem]",
        tone === "ondark" ? "text-brass-soft" : "text-brass",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * The verification stamp. Per spec: status is NEVER colour alone — always
 * icon + text. Used across the Signal, the Record and the Records ledger.
 */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "mono-readout inline-flex items-center gap-1.5 text-[0.65rem] text-verified",
        className,
      )}
    >
      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
      Verified
    </span>
  );
}
