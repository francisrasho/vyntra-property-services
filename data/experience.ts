/**
 * The guided homepage experience. Each entry is both a hotspot on the hero
 * house and a full-screen "scene" you fly into. Positions are percentages of
 * the hero box, placed over the matching feature of luxuryhouseatdark.webp.
 */
export type ExperienceScene = {
  /** Anchor id used for the fly-to scroll target. */
  id: string;
  /** Hotspot label shown on hover. */
  label: string;
  /** Hotspot position as a percentage of the hero (x = left, y = top). */
  hotspot: { x: number; y: number };
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Existing service detail page for the optional "view details" link. */
  serviceSlug: string;
};

export const scenes: ExperienceScene[] = [
  {
    id: "handyman",
    label: "Handyman Services",
    hotspot: { x: 33, y: 64 },
    image: "/garage.webp",
    eyebrow: "The Garage",
    title: "Handyman Services",
    description:
      "From a sticking door to a full punch-list, our vetted handymen arrive on time, do it right the first time and leave the space clean — with a photo record of every job.",
    serviceSlug: "handyman-services",
  },
  {
    id: "cleaning-services",
    label: "Cleaning Services",
    hotspot: { x: 79, y: 60 },
    image: "/kitchen.webp",
    eyebrow: "The Kitchen",
    title: "Cleaning Services",
    description:
      "Detail-driven cleaning that makes interiors shine — every surface sanitised, audited and photo-verified, so the space always looks impeccable.",
    serviceSlug: "end-of-lease-cleaning",
  },
  {
    id: "pressure-washing",
    label: "Pressure Washing",
    hotspot: { x: 13, y: 85 },
    image: "/outdoor.webp",
    eyebrow: "The Grounds",
    title: "Pressure Washing",
    description:
      "High-pressure cleaning that strips grime, oil and biological growth from driveways, façades and outdoor areas — restoring surfaces and removing slip hazards.",
    serviceSlug: "pressure-washing",
  },
  {
    id: "commercial-cleaning",
    label: "Commercial Cleaning",
    hotspot: { x: 82, y: 30 },
    image: "/office.webp",
    eyebrow: "The Office",
    title: "Commercial Cleaning",
    description:
      "Presentation-perfect cleaning for offices and commercial premises — consistent crews, documented scopes and digital quality reporting on every visit.",
    serviceSlug: "commercial-cleaning",
  },
];
