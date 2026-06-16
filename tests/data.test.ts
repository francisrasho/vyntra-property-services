import { describe, it, expect } from "vitest";
import { services, serviceSlugs } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { testimonials } from "@/data/testimonials";
import { serviceAreas } from "@/data/serviceAreas";
import { faqs } from "@/data/faqs";
import { whyChoose } from "@/data/whyChoose";
import { stats } from "@/data/stats";
import { company } from "@/data/company";

describe("services data", () => {
  it("has exactly 9 services", () => {
    expect(services).toHaveLength(9);
  });

  it("has unique, url-safe slugs", () => {
    const unique = new Set(serviceSlugs);
    expect(unique.size).toBe(services.length);
    for (const slug of serviceSlugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has all required, non-empty fields per service", () => {
    for (const s of services) {
      expect(s.name.length).toBeGreaterThan(0);
      expect(s.icon.length).toBeGreaterThan(0);
      expect(s.tagline.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.problem.length).toBeGreaterThan(0);
      expect(s.solution.length).toBeGreaterThan(0);
      expect(s.benefits.length).toBeGreaterThanOrEqual(3);
      expect(s.process.length).toBeGreaterThanOrEqual(3);
      expect(s.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("supporting content", () => {
  it("has at least the expected volume of content", () => {
    expect(whyChoose).toHaveLength(8);
    expect(stats).toHaveLength(4);
    expect(testimonials.length).toBeGreaterThanOrEqual(6);
    expect(caseStudies.length).toBeGreaterThanOrEqual(3);
    expect(faqs.length).toBeGreaterThanOrEqual(8);
    expect(serviceAreas.length).toBeGreaterThanOrEqual(6);
  });

  it("case studies reference valid service slugs", () => {
    for (const cs of caseStudies) {
      for (const slug of cs.services) {
        expect(serviceSlugs).toContain(slug);
      }
    }
  });

  it("service-area map coordinates are within 0-100", () => {
    for (const area of serviceAreas) {
      expect(area.x).toBeGreaterThanOrEqual(0);
      expect(area.x).toBeLessThanOrEqual(100);
      expect(area.y).toBeGreaterThanOrEqual(0);
      expect(area.y).toBeLessThanOrEqual(100);
    }
  });

  it("exposes core company contact fields", () => {
    expect(company.name).toBe("Vyntra Property Services");
    expect(company.phone).toMatch(/^\+/);
    expect(company.email).toContain("@");
  });
});
