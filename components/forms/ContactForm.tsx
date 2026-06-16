"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Paperclip, PhoneCall } from "lucide-react";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { Button } from "@/components/ui/Button";
import { TextField, TextareaField, SelectField, Choice } from "./fields";
import { useLeadSubmit } from "./useLeadSubmit";

interface ContactValues {
  name: string;
  phone: string;
  email: string;
  service: string;
  propertyType: string;
  budget: string;
  message: string;
}

const propertyTypes = [
  { value: "commercial", label: "Commercial" },
  { value: "strata", label: "Strata" },
  { value: "office", label: "Office" },
  { value: "residential", label: "Residential" },
  { value: "other", label: "Other" },
];

const budgets = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-5000", label: "$1,500 – $5,000" },
  { value: "5000-plus", label: "$5,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

export function ContactForm() {
  const methods = useForm<ContactValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "",
      propertyType: "",
      budget: "",
      message: "",
    },
    mode: "onTouched",
  });
  const [preferredContact, setPreferredContact] = useState<"phone" | "email">("phone");
  const [fileName, setFileName] = useState<string | null>(null);
  const { status, error, submit } = useLeadSubmit();

  const onSubmit = methods.handleSubmit(async (values) => {
    const serviceName =
      services.find((s) => s.slug === values.service)?.name ?? values.service;
    await submit({
      source: "contact_form",
      name: values.name,
      email: values.email,
      phone: values.phone,
      service: serviceName,
      propertyType: values.propertyType,
      budget: values.budget,
      message: values.message,
      preferredContact,
      meta: { hasAttachment: !!fileName, fileName },
    });
  });

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold-dark">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-ink">Message sent</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
          Thanks for reaching out. A member of the Vyntra team will respond
          shortly. For urgent matters, call us any time.
        </p>
        <div className="mt-5 flex justify-center">
          <Button href={`tel:${company.phone}`} external variant="secondary" size="sm">
            <PhoneCall className="h-4 w-4" /> {company.phoneDisplay}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="name"
            label="Name"
            required
            autoComplete="name"
            rules={{ required: "Please enter your name", minLength: { value: 2, message: "Please enter your name" } }}
          />
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            required
            autoComplete="tel"
            rules={{ required: "Please enter your phone", minLength: { value: 6, message: "Please enter a valid phone" } }}
          />
        </div>
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          rules={{
            required: "Please enter your email",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email" },
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="service"
            label="Service required"
            options={services.map((s) => ({ value: s.slug, label: s.name }))}
          />
          <SelectField name="propertyType" label="Property type" options={propertyTypes} />
        </div>
        <SelectField name="budget" label="Indicative budget" options={budgets} />
        <TextareaField
          name="message"
          label="Message"
          placeholder="Tell us about your property and what you need…"
          rows={5}
        />

        {/* File upload — UI only in Phase 1; attachments are not yet stored. */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Attach a file{" "}
            <span className="font-normal text-ink-600/70">(optional)</span>
          </span>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-ink/20 bg-white/60 px-4 py-3 text-sm text-ink-600 transition hover:border-gold/50">
            <Paperclip className="h-4 w-4 text-gold-dark" />
            <span>{fileName ?? "Choose a file (photos, plans, scope)…"}</span>
            <input
              type="file"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-ink">
            Preferred contact method
          </span>
          <div className="grid max-w-xs grid-cols-2 gap-2">
            <Choice selected={preferredContact === "phone"} onClick={() => setPreferredContact("phone")}>
              Phone
            </Choice>
            <Choice selected={preferredContact === "email"} onClick={() => setPreferredContact("email")}>
              Email
            </Choice>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>Send message</>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
