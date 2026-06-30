import { getService } from "@/data/services";

/**
 * Placeholder 360° asset. Swap this for your own equirectangular photo or video
 * (2:1 ratio, e.g. 4096×2048 JPG). Drop the file in /public/panorama/ and update
 * this path — nothing else needs to change. See /public/panorama/README.md.
 */
export const PANORAMA_SRC = "/panorama/placeholder-property.jpg";

/** Initial view + field-of-view tuning for the viewer (degrees / zoom 0–100). */
export const PANORAMA_VIEW = {
  defaultYaw: 12,
  defaultPitch: -2,
  defaultZoom: 45,
  minZoom: 30,
  maxZoom: 70,
};

export interface HeroZone {
  /** Stable id used as the marker id. */
  id: string;
  /** The place inside the property this hotspot represents. */
  zone: string;
  /** Service slug in data/services.ts — drives the panel content + View Service link. */
  slug: string;
  /** Optional panel title override (otherwise the service name is used). */
  title?: string;
  /** Hotspot position in the panorama, in degrees. */
  yaw: number;
  pitch: number;
  /** Accent colour for the marker + panel. */
  accent: string;
  /** Emergency-style marker (pulsing alert). */
  alert?: boolean;
}

/**
 * The seven service zones of the walkthrough. Yaw values are spaced evenly around
 * the 360 and aligned to the tinted areas of the placeholder panorama, so each
 * hotspot sits on its own zone. Adjust yaw/pitch to match your real imagery.
 */
export const HERO_ZONES: HeroZone[] = [
  { id: "lobby", zone: "Lobby / Common Area", slug: "strata-cleaning", yaw: 25.7, pitch: -5, accent: "#d4af37" },
  { id: "office", zone: "Office Area", slug: "office-cleaning", title: "Commercial & Office Cleaning", yaw: 77.1, pitch: -3, accent: "#7da0ff" },
  { id: "exterior", zone: "Exterior / Driveway", slug: "pressure-washing", yaw: 128.6, pitch: -8, accent: "#9fb0c6" },
  { id: "garden", zone: "Garden / Outdoor Area", slug: "garden-maintenance", yaw: 180, pitch: -6, accent: "#5cc27e" },
  { id: "apartment", zone: "Apartment / Room", slug: "end-of-lease-cleaning", yaw: 231.4, pitch: -5, accent: "#e6b074" },
  { id: "maintenance", zone: "Maintenance / Toolbox Area", slug: "property-maintenance", title: "Property Maintenance & Handyman", yaw: 282.9, pitch: -6, accent: "#d8853a" },
  { id: "emergency", zone: "Emergency Support", slug: "emergency-property-support", yaw: 334.3, pitch: 3, accent: "#e0584f", alert: true },
];

export interface ZoneContent {
  zone: string;
  title: string;
  tagline: string;
  description: string;
  benefits: string[];
  href: string;
  accent: string;
}

/** Resolve a zone into the content the panel renders, pulling from data/services. */
export function getZoneContent(zone: HeroZone): ZoneContent {
  const service = getService(zone.slug);
  return {
    zone: zone.zone,
    title: zone.title ?? service?.name ?? zone.zone,
    tagline: service?.tagline ?? "",
    description: service?.description ?? "",
    benefits: (service?.benefits ?? []).slice(0, 4),
    href: `/services/${zone.slug}`,
    accent: zone.accent,
  };
}
