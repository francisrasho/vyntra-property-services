/** Shared content types. Content modules import these so everything stays typed
 *  and the (placeholder) data is easy to swap for real Vyntra content later. */

export interface Company {
  name: string;
  legalName: string;
  tagline: string;
  /** TODO: real phone in E.164 for tel: links */
  phone: string;
  phoneDisplay: string;
  /** TODO: real after-hours emergency line */
  emergencyPhone: string;
  emergencyPhoneDisplay: string;
  /** TODO: real inbox */
  email: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  /** TODO: real ABN */
  abn: string;
  hours: { days: string; time: string }[];
  socials: { label: string; href: string }[];
}

export interface ProcessStep {
  title: string;
  detail: string;
}

export interface Service {
  slug: string;
  name: string;
  /** lucide-react icon name, resolved to a component in the UI layer. */
  icon: string;
  tagline: string;
  /** Short description used on cards. */
  description: string;
  problem: string;
  solution: string;
  benefits: string[];
  process: ProcessStep[];
  idealFor: string[];
  keywords: string[];
}

export interface Stat {
  /** Numeric stats animate; set null for text-only stats (use `display`). */
  value: number | null;
  display?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export interface WhyReason {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  initials: string;
}

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  results: CaseStudyResult[];
  image: string;
  beforeImage: string;
  afterImage: string;
  testimonial?: { quote: string; name: string; role: string };
  /** Related service slugs. */
  services: string[];
}

export interface ServiceArea {
  id: string;
  name: string;
  suburbs: string[];
  responseTime: string;
  availability: "available" | "high-demand";
  /** Position on the stylised SVG map, as percentages (0–100). */
  x: number;
  y: number;
}

export interface Faq {
  question: string;
  answer: string;
}

/* ------------------------------------------------------------------ *\
   Vyntra OS content — records, people and the live signal.
   These are the integration boundary: Tier 1 reads typed seed data;
   Tier 2 swaps the source to live Vyntra OS via lib/repository.
\* ------------------------------------------------------------------ */

export type Segment = "strata" | "commercial" | "residential";

/** A single completed, documented job — the atom of the whole experience. */
export interface VyntraRecord {
  /** OS job id, e.g. "STR-118". */
  id: string;
  /** ISO date completed. */
  date: string;
  suburb: string;
  serviceSlug: string;
  serviceName: string;
  segment: Segment;
  /** One-line outcome shown when a record is opened. */
  summary: string;
  /** Real asset paths under /public; empty string renders a branded placeholder. */
  beforeImage: string;
  afterImage: string;
  /** Always "verified" for published records. */
  status: "verified";
}

/** A live (or settled) operating event in the Signal stream. */
export interface SignalEvent {
  /** Display time, e.g. "07:14". */
  time: string;
  id: string;
  suburb: string;
  /** Short service/action label, e.g. "Common areas". */
  action: string;
  status: "verified" | "scheduled" | "en-route" | "on-site";
}

/** A real human tied to a real record — client, contractor or Vyntra team. */
export interface VerifiedPerson {
  kind: "client" | "contractor" | "team";
  name: string;
  role: string;
  company?: string;
  quote: string;
  /** Real portrait path under /public; empty string renders a placeholder. */
  image: string;
  /** Record this voice is anchored to (client/contractor). */
  recordId?: string;
  suburb?: string;
  /** Mono credential tags (contractor/team). */
  credentials?: string[];
}
