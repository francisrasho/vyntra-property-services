import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/schema";

const base = {
  source: "contact_form" as const,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "0400 000 000",
};

describe("leadSchema", () => {
  it("accepts a valid lead and applies defaults", () => {
    const r = leadSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.preferredContact).toBe("phone");
      expect(r.data.service).toBe("");
      expect(r.data.message).toBe("");
    }
  });

  it("rejects a missing/too-short name", () => {
    expect(leadSchema.safeParse({ ...base, name: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(leadSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(
      false,
    );
  });

  it("rejects a too-short phone", () => {
    expect(leadSchema.safeParse({ ...base, phone: "123" }).success).toBe(false);
  });

  it("rejects an unknown source", () => {
    expect(leadSchema.safeParse({ ...base, source: "hacker" }).success).toBe(
      false,
    );
  });

  it("accepts optional estimate fields and property type", () => {
    const r = leadSchema.safeParse({
      ...base,
      source: "instant_estimate",
      propertyType: "office",
      estimateLow: 100,
      estimateHigh: 200,
    });
    expect(r.success).toBe(true);
  });
});
