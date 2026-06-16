import { describe, it, expect } from "vitest";
import { estimateRange } from "@/lib/estimate";

describe("estimateRange", () => {
  it("returns the base range for a one-off small job", () => {
    expect(estimateRange("office-cleaning", "small", "once")).toEqual({
      low: 150,
      high: 280,
    });
  });

  it("scales up with property size", () => {
    const small = estimateRange("office-cleaning", "small", "once");
    const large = estimateRange("office-cleaning", "large", "once");
    expect(large.low).toBeGreaterThan(small.low);
    expect(large.high).toBeGreaterThan(small.high);
  });

  it("discounts recurring frequencies below a one-off", () => {
    const once = estimateRange("office-cleaning", "medium", "once");
    const weekly = estimateRange("office-cleaning", "medium", "weekly");
    expect(weekly.low).toBeLessThan(once.low);
  });

  it("always returns low <= high, including for unknown services", () => {
    const r = estimateRange("does-not-exist", "medium", "monthly");
    expect(r.low).toBeLessThanOrEqual(r.high);
    expect(r.low).toBeGreaterThan(0);
  });
});
