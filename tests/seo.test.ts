import { describe, it, expect } from "vitest";
import {
  serviceSchema,
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
} from "@/lib/seo";
import { faqs } from "@/data/faqs";

describe("SEO JSON-LD schemas", () => {
  it("builds a LocalBusiness schema with required fields", () => {
    const s = localBusinessSchema();
    expect(s["@type"]).toBe("LocalBusiness");
    expect(s.telephone).toBeTruthy();
    expect(Array.isArray(s.areaServed)).toBe(true);
    expect(s.areaServed.length).toBeGreaterThan(0);
  });

  it("builds a Service schema pointing at the service URL", () => {
    const s = serviceSchema({
      name: "Office Cleaning",
      description: "desc",
      slug: "office-cleaning",
    });
    expect(s["@type"]).toBe("Service");
    expect(s.url).toContain("/services/office-cleaning");
  });

  it("builds a FAQPage schema from the FAQ data", () => {
    const s = faqSchema(faqs);
    expect(s["@type"]).toBe("FAQPage");
    expect(s.mainEntity.length).toBe(faqs.length);
    expect(s.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
  });

  it("builds a BreadcrumbList with sequential positions", () => {
    const s = breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
    ]);
    expect(s["@type"]).toBe("BreadcrumbList");
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].position).toBe(2);
  });
});
