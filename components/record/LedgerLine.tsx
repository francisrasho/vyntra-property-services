import { cn } from "@/lib/cn";
import { MonoReadout, VerifiedBadge } from "@/components/ui/os";

type Status = "verified" | "scheduled" | "en-route" | "on-site";

const statusLabel: Record<Status, string> = {
  verified: "Verified",
  scheduled: "Scheduled",
  "en-route": "En route",
  "on-site": "On site",
};

/**
 * One mono record line — the shared DNA of the Live Signal (streaming) and the
 * Records ledger (settled). Columns are tabular so they align like a register.
 */
export function LedgerLine({
  lead,
  id,
  suburb,
  action,
  status,
  tone = "dark",
  className,
}: {
  /** Leading column — a time (Signal) or a date (Records). */
  lead: string;
  id: string;
  suburb: string;
  action: string;
  status: Status;
  tone?: "dark" | "light";
  className?: string;
}) {
  const onDark = tone === "dark";
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b py-3.5 text-xs sm:gap-5",
        onDark ? "border-line-dark" : "border-line",
        className,
      )}
    >
      <MonoReadout
        className={cn(
          "tabular w-12 shrink-0",
          onDark ? "text-ondark-400" : "text-ink-400",
        )}
      >
        {lead}
      </MonoReadout>
      <MonoReadout
        className={cn(
          "w-16 shrink-0",
          onDark ? "text-brass-soft" : "text-brass",
        )}
      >
        {id}
      </MonoReadout>
      <span
        className={cn(
          "hidden w-28 shrink-0 truncate font-sans sm:block",
          onDark ? "text-ondark" : "text-ink",
        )}
      >
        {suburb}
      </span>
      <span
        className={cn(
          "flex-1 truncate font-sans",
          onDark ? "text-ondark-600" : "text-ink-600",
        )}
      >
        {action}
      </span>
      {status === "verified" ? (
        <VerifiedBadge />
      ) : (
        <MonoReadout
          className={cn(onDark ? "text-ondark-400" : "text-ink-400")}
        >
          {statusLabel[status]}
        </MonoReadout>
      )}
    </div>
  );
}
