import { z } from "zod";

/** Validates every lead payload (quote, contact, instant estimate, exit intent)
 *  before it is forwarded to the lead sink. */
export const leadSchema = z.object({
  source: z.enum([
    "quote_form",
    "contact_form",
    "instant_estimate",
    "exit_intent",
  ]),
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(6, "Please enter a valid phone number"),
  service: z.string().trim().optional().default(""),
  propertyType: z
    .enum(["commercial", "strata", "office", "residential", "other"])
    .optional(),
  budget: z.string().trim().optional().default(""),
  suburb: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
  preferredContact: z.enum(["phone", "email"]).optional().default("phone"),
  estimateLow: z.number().nullable().optional(),
  estimateHigh: z.number().nullable().optional(),
  /** Honeypot — real users never see or fill this. Must stay empty. */
  company_website: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
