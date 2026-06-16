import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small pill used for trust indicators and labels. */
export function Badge({
  children,
  className,
  icon,
  invert = false,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  invert?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        invert
          ? "border-white/15 bg-white/10 text-white/90"
          : "border-ink/10 bg-white/70 text-ink-600",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
