import type { VerifiedPerson } from "./types";

/**
 * VERIFIED PEOPLE — Tier 1.
 *
 * ⚠️ PLACEHOLDER DATA. Real faces, real consent only — no stock people. Any
 * named client linked to a record must approve being shown. Portraits land
 * with the directed shoot; empty image fields render a branded placeholder.
 */
export const people: VerifiedPerson[] = [
  {
    kind: "client",
    name: "Strata Committee Chair",
    role: "Residential strata, 42 units",
    company: "Mosman",
    quote:
      "For the first time I can actually show owners what was done, when, and that it was checked. The reporting ended every 'did they even come?' argument.",
    image: "",
    recordId: "STR-118",
    suburb: "Mosman",
  },
  {
    kind: "contractor",
    name: "Daniel R.",
    role: "Vyntra contractor",
    quote:
      "Every job has a clear scope before I arrive and a photo record when I leave. There's no ambiguity — the standard is the standard.",
    image: "",
    recordId: "STR-118",
    credentials: ["Insured", "Police-checked", "★ 4.9", "312 jobs"],
  },
  {
    kind: "client",
    name: "Facilities Manager",
    role: "Commercial retail",
    company: "Sydney CBD",
    quote:
      "The space is ready before doors open, every single day, and I get the verification without chasing anyone. That consistency is the whole point.",
    image: "",
    recordId: "COM-204",
    suburb: "Sydney CBD",
  },
  {
    kind: "team",
    name: "Operations, Vyntra",
    role: "Quality assurance",
    quote:
      "Nothing is marked complete until it's photo-verified against the scope. The record is the product — the clean is just how we get there.",
    image: "",
    credentials: ["Vyntra OS", "QA verified"],
  },
];
