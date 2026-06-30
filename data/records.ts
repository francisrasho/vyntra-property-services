import type { VyntraRecord } from "./types";

/**
 * SEED RECORDS — Tier 1 archive.
 *
 * ⚠️ PLACEHOLDER DATA. Every record here must be replaced with a REAL,
 * documented Vyntra job before launch (per the locked spec — the section's
 * power is that it is true). Image fields are intentionally empty until the
 * directed shoot lands; the UI renders a branded placeholder in the meantime.
 * Privacy rule: suburb + service + status + date only — never client/site names.
 */
export const records: VyntraRecord[] = [
  {
    id: "STR-118",
    date: "2026-06-12",
    suburb: "Mosman",
    serviceSlug: "strata-cleaning",
    serviceName: "Strata Cleaning",
    segment: "strata",
    summary:
      "Common areas, lifts and bin rooms restored to a documented standard across a 42-unit residential building.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "COM-204",
    date: "2026-06-10",
    suburb: "Sydney CBD",
    serviceSlug: "commercial-cleaning",
    serviceName: "Commercial Cleaning",
    segment: "commercial",
    summary:
      "Nightly presentation clean for a ground-floor retail flagship, photo-verified before opening.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "EOL-087",
    date: "2026-06-09",
    suburb: "Surry Hills",
    serviceSlug: "end-of-lease-cleaning",
    serviceName: "End of Lease Cleaning",
    segment: "residential",
    summary:
      "Full bond-back clean delivered to agent checklist; passed inspection first time.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "PWS-052",
    date: "2026-06-06",
    suburb: "Pyrmont",
    serviceSlug: "pressure-washing",
    serviceName: "Pressure Washing",
    segment: "commercial",
    summary:
      "Car park and entry forecourt stripped of oil and grime, slip hazards reduced.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "STR-115",
    date: "2026-06-04",
    suburb: "Chatswood",
    serviceSlug: "strata-cleaning",
    serviceName: "Strata Cleaning",
    segment: "strata",
    summary:
      "Scheduled deep clean of lobby, stairwells and shared amenities for a mixed-use tower.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "OFF-141",
    date: "2026-06-03",
    suburb: "North Sydney",
    serviceSlug: "office-cleaning",
    serviceName: "Office Cleaning",
    segment: "commercial",
    summary:
      "After-hours office clean with sanitised touchpoints; consistent crew, zero disruption.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "MNT-073",
    date: "2026-05-30",
    suburb: "Parramatta",
    serviceSlug: "property-maintenance",
    serviceName: "Property Maintenance",
    segment: "commercial",
    summary:
      "Reactive maintenance across a managed portfolio, coordinated and signed off in one record.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "GDN-039",
    date: "2026-05-28",
    suburb: "Castle Hill",
    serviceSlug: "garden-maintenance",
    serviceName: "Garden Maintenance",
    segment: "strata",
    summary:
      "Shared grounds mowed, edged and tidied; green waste removed, site left clean.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "EOL-081",
    date: "2026-05-26",
    suburb: "Bondi",
    serviceSlug: "end-of-lease-cleaning",
    serviceName: "End of Lease Cleaning",
    segment: "residential",
    summary:
      "Two-bedroom apartment detailed to handover standard between tenancies.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "HND-058",
    date: "2026-05-22",
    suburb: "Manly",
    serviceSlug: "handyman-services",
    serviceName: "Handyman Services",
    segment: "residential",
    summary:
      "Repairs and finishing across a managed rental, documented with photo records.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "EMG-012",
    date: "2026-05-19",
    suburb: "Newtown",
    serviceSlug: "emergency-property-support",
    serviceName: "Emergency Support",
    segment: "strata",
    summary:
      "After-hours make-safe and clean-up following water ingress; insurer-ready report.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
  {
    id: "COM-198",
    date: "2026-05-16",
    suburb: "Randwick",
    serviceSlug: "commercial-cleaning",
    serviceName: "Commercial Cleaning",
    segment: "commercial",
    summary:
      "Medical suite cleaned to hygiene standard with photo verification on every visit.",
    beforeImage: "",
    afterImage: "",
    status: "verified",
  },
];

/** The headline job followed end-to-end in The Record walkthrough. */
export const featuredRecordId = "STR-118";

export const getRecord = (id: string) => records.find((r) => r.id === id);
