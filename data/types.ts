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
