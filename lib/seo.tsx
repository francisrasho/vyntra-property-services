import { company } from "@/data/company";
import { serviceAreas } from "@/data/serviceAreas";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Renders a JSON-LD <script>. Place inside any server component. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_URL,
    name: company.name,
    image: `${SITE_URL}/opengraph-image`,
    url: SITE_URL,
    telephone: company.phone,
    email: company.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.suburb,
      addressRegion: company.address.state,
      postalCode: company.address.postcode,
      addressCountry: "AU",
    },
    areaServed: serviceAreas.map((a) => ({ "@type": "City", name: a.name })),
    openingHours: ["Mo-Fr 07:00-18:00", "Sa 08:00-16:00"],
    sameAs: company.socials.map((s) => s.href).filter((h) => h && h !== "#"),
  };
}

export function serviceSchema(s: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    serviceType: s.name,
    areaServed: { "@type": "City", name: "Sydney" },
    provider: {
      "@type": "LocalBusiness",
      name: company.name,
      telephone: company.phone,
    },
    url: `${SITE_URL}/services/${s.slug}`,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}
