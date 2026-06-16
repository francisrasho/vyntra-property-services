import type { CaseStudy } from "./types";

/** Placeholder case studies. Imagery uses picsum.photos seeds — swap for real
 *  before/after project photography before launch. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "harbourline-strata-turnaround",
    title: "Turning around a 120-unit strata complex",
    client: "Harbourline Strata",
    category: "Strata Cleaning",
    summary:
      "A neglected harbourside complex was generating constant owner complaints. Vyntra restored standards and cut complaints to near zero.",
    problem:
      "The previous contractor delivered inconsistent cleans with no reporting. Lobbies, lifts and car parks looked tired, and the strata committee was fielding weekly complaints from owners and residents.",
    solution:
      "We rebuilt the cleaning scope from the ground up, introduced photo-verified checklists for every common area, scheduled quarterly pressure washing, and gave the committee a single accountable account manager.",
    results: [
      { label: "Owner complaints", value: "−92%" },
      { label: "Common-area audit score", value: "98%" },
      { label: "Contractor consolidation", value: "1 partner" },
    ],
    image: "https://picsum.photos/seed/vyntra-strata/1200/800",
    beforeImage: "https://picsum.photos/seed/vyntra-strata-before/1200/800",
    afterImage: "https://picsum.photos/seed/vyntra-strata-after/1200/800",
    testimonial: {
      quote:
        "The reporting alone has saved us countless owner complaints — we always know exactly what was done.",
      name: "Sarah Mitchell",
      role: "Strata Manager, Harbourline Strata",
    },
    services: ["strata-cleaning", "pressure-washing"],
  },
  {
    slug: "meridian-commercial-maintenance",
    title: "One maintenance partner for 14 commercial sites",
    client: "Meridian Commercial",
    category: "Property Maintenance",
    summary:
      "A growing commercial portfolio was drowning in trades and slow callbacks. Vyntra became their single maintenance partner.",
    problem:
      "Meridian was coordinating dozens of trades across 14 sites with no central record. Response times were slow, quotes were inconsistent, and small issues regularly escalated into expensive repairs.",
    solution:
      "Vyntra became the single point of contact for all reactive and preventative maintenance, with triaged requests, itemised quoting and a documented job history for every property.",
    results: [
      { label: "Average response time", value: "< 24 hrs" },
      { label: "Sites managed", value: "14" },
      { label: "Maintenance spend visibility", value: "100%" },
    ],
    image: "https://picsum.photos/seed/vyntra-commercial/1200/800",
    beforeImage: "https://picsum.photos/seed/vyntra-commercial-before/1200/800",
    afterImage: "https://picsum.photos/seed/vyntra-commercial-after/1200/800",
    testimonial: {
      quote:
        "Their response times on maintenance are the best we've worked with in Sydney.",
      name: "James Donovan",
      role: "Facilities Manager, Meridian Commercial",
    },
    services: ["property-maintenance", "handyman-services"],
  },
  {
    slug: "the-quay-emergency-response",
    title: "Weekend burst pipe made safe within the hour",
    client: "The Quay Residences",
    category: "Emergency Property Support",
    summary:
      "A burst pipe flooded multiple levels on a Saturday night. Vyntra mobilised immediately and prevented major damage.",
    problem:
      "Water from a failed riser was spreading across three residential levels late on a weekend, with no response from the building's usual contractors and residents growing anxious.",
    solution:
      "Our emergency crew was on site within the hour to make the building safe, extract water, begin drying, and coordinate the follow-up repairs — communicating with the building manager throughout.",
    results: [
      { label: "On-site response", value: "< 60 min" },
      { label: "Levels protected", value: "3" },
      { label: "Insurance documentation", value: "Full" },
    ],
    image: "https://picsum.photos/seed/vyntra-emergency/1200/800",
    beforeImage: "https://picsum.photos/seed/vyntra-emergency-before/1200/800",
    afterImage: "https://picsum.photos/seed/vyntra-emergency-after/1200/800",
    testimonial: {
      quote:
        "They made the building safe and kept us informed the whole way through.",
      name: "Rebecca Lawson",
      role: "Building Manager, The Quay Residences",
    },
    services: ["emergency-property-support", "property-maintenance"],
  },
];

export const getCaseStudy = (slug: string) =>
  caseStudies.find((c) => c.slug === slug);

export const caseStudySlugs = caseStudies.map((c) => c.slug);
