import type { SignalEvent } from "./types";

/**
 * THE LIVE SIGNAL — Tier 1 reel.
 *
 * ⚠️ PLACEHOLDER DATA. At launch this must be a curated reel of REAL completed
 * jobs (anonymised: suburb + action + status + time only). Tier 2 swaps this
 * for a periodic/live feed from Vyntra OS. Never fabricate a stream.
 */
export const signalEvents: SignalEvent[] = [
  { time: "07:14", id: "STR-118", suburb: "Mosman", action: "Common areas", status: "verified" },
  { time: "07:02", id: "COM-204", suburb: "Sydney CBD", action: "Retail presentation", status: "verified" },
  { time: "06:58", id: "OFF-141", suburb: "North Sydney", action: "Office clean", status: "on-site" },
  { time: "06:41", id: "EOL-087", suburb: "Surry Hills", action: "Bond-back clean", status: "verified" },
  { time: "06:30", id: "MNT-073", suburb: "Parramatta", action: "Maintenance", status: "en-route" },
  { time: "06:12", id: "PWS-052", suburb: "Pyrmont", action: "Pressure washing", status: "verified" },
  { time: "05:55", id: "STR-115", suburb: "Chatswood", action: "Lobby deep clean", status: "scheduled" },
  { time: "05:40", id: "GDN-039", suburb: "Castle Hill", action: "Grounds upkeep", status: "verified" },
  { time: "05:21", id: "COM-198", suburb: "Randwick", action: "Medical suite", status: "verified" },
  { time: "05:08", id: "EOL-081", suburb: "Bondi", action: "Handover clean", status: "verified" },
];

/** Aggregate operating telemetry. ⚠️ Must be REAL figures before launch. */
export const signalTelemetry = {
  recordsTotal: 1284,
  verifiedPct: 100,
  activeSites: 37,
  avgResponse: "2.4h",
  since: 2021,
};
