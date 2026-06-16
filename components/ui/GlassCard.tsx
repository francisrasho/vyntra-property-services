import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Frosted-glass surface. `dark` variant sits on navy sections. */
export function GlassCard({
  className,
  children,
  dark = false,
}: {
  className?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        dark ? "glass-dark text-white" : "glass",
        "rounded-2xl shadow-[var(--shadow-glass)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
