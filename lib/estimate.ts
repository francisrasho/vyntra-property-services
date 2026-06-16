export type PropertySize = "small" | "medium" | "large";
export type Frequency = "once" | "weekly" | "fortnightly" | "monthly";

export interface EstimateRange {
  low: number;
  high: number;
}

/** Indicative per-visit price ranges (AUD) by service. Deliberately broad —
 *  the instant estimate sets expectations, the real quote is exact. */
const BASE: Record<string, [number, number]> = {
  "commercial-cleaning": [180, 320],
  "office-cleaning": [150, 280],
  "strata-cleaning": [220, 420],
  "property-maintenance": [120, 400],
  "handyman-services": [90, 280],
  "pressure-washing": [200, 550],
  "garden-maintenance": [110, 260],
  "end-of-lease-cleaning": [280, 650],
  "emergency-property-support": [180, 600],
};

const SIZE: Record<PropertySize, number> = {
  small: 1,
  medium: 1.7,
  large: 2.8,
};

/** Recurring work earns a lower per-visit rate than a one-off. */
const FREQUENCY: Record<Frequency, number> = {
  once: 1,
  weekly: 0.7,
  fortnightly: 0.8,
  monthly: 0.9,
};

const roundTo5 = (n: number) => Math.round(n / 5) * 5;

/** Deterministic indicative estimate for a service + size + frequency. */
export function estimateRange(
  serviceSlug: string,
  size: PropertySize,
  frequency: Frequency,
): EstimateRange {
  const base = BASE[serviceSlug] ?? [120, 400];
  const sizeMult = SIZE[size] ?? 1;
  const freqMult = FREQUENCY[frequency] ?? 1;
  return {
    low: roundTo5(base[0] * sizeMult * freqMult),
    high: roundTo5(base[1] * sizeMult * freqMult),
  };
}
