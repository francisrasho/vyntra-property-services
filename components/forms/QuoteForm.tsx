"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { Button } from "@/components/ui/Button";
import { TextField, TextareaField, SelectField, Choice } from "./fields";
import { useLeadSubmit } from "./useLeadSubmit";

interface QuoteValues {
  suburb: string;
  budget: string;
  preferredDate: string;
  message: string;
  name: string;
  phone: string;
  email: string;
}

const propertyTypes = [
  { value: "commercial", label: "Commercial" },
  { value: "strata", label: "Strata" },
  { value: "office", label: "Office" },
  { value: "residential", label: "Residential" },
  { value: "other", label: "Other" },
];

const frequencies = [
  { value: "once", label: "One-off" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

const budgets = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-5000", label: "$1,500 – $5,000" },
  { value: "5000-plus", label: "$5,000+" },
  { value: "not-sure", label: "Not sure yet" },
];

const STEPS = ["Services", "Property", "Details", "Contact"];

export function QuoteForm({ onSuccess }: { onSuccess?: () => void }) {
  const methods = useForm<QuoteValues>({
    defaultValues: {
      suburb: "",
      budget: "",
      preferredDate: "",
      message: "",
      name: "",
      phone: "",
      email: "",
    },
    mode: "onTouched",
  });
  const { trigger, handleSubmit } = methods;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [serviceError, setServiceError] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [propertyError, setPropertyError] = useState(false);
  const [frequency, setFrequency] = useState("once");
  const [preferredContact, setPreferredContact] = useState<"phone" | "email">("phone");

  const { status, error, submit } = useLeadSubmit();

  function toggleService(slug: string) {
    setServiceError(false);
    setSelected((cur) =>
      cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug],
    );
  }

  async function next() {
    if (step === 0) {
      if (selected.length === 0) {
        setServiceError(true);
        return;
      }
    } else if (step === 1) {
      if (!propertyType) {
        setPropertyError(true);
        return;
      }
    } else if (step === 2) {
      const ok = await trigger("suburb");
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const onSubmit = handleSubmit(async (values) => {
    const serviceNames = selected.map(
      (slug) => services.find((s) => s.slug === slug)?.name ?? slug,
    );
    const ok = await submit({
      source: "quote_form",
      name: values.name,
      email: values.email,
      phone: values.phone,
      service: serviceNames.join(", "),
      propertyType,
      budget: values.budget,
      suburb: values.suburb,
      message: values.message,
      preferredContact,
      meta: {
        frequency,
        serviceSlugs: selected,
        preferredDate: values.preferredDate,
      },
    });
    if (ok) onSuccess?.();
  });

  if (status === "success") {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold-dark">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-ink">Request received</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
          Thank you — a member of the Vyntra team will be in touch shortly with
          your tailored quote. Need us sooner?
        </p>
        <div className="mt-5 flex justify-center">
          <Button href={`tel:${company.phone}`} external variant="secondary" size="sm">
            <PhoneCall className="h-4 w-4" /> Call {company.phoneDisplay}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate>
        <h3 className="text-xl font-bold text-ink">Request a free quote</h3>
        <p className="mt-1 text-sm text-ink-600">
          Takes under a minute. No obligation.
        </p>

        {/* Progress */}
        <div className="mt-5 flex items-center gap-2" aria-hidden>
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={
                  "h-1.5 rounded-full transition-colors " +
                  (i <= step ? "bg-gold" : "bg-ink/10")
                }
              />
              <span
                className={
                  "mt-1.5 block text-[11px] font-medium " +
                  (i <= step ? "text-ink" : "text-ink-600/60")
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 min-h-[230px]">
          {step === 0 && (
            <fieldset>
              <legend className="mb-3 text-sm font-medium text-ink">
                Which services do you need?
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => (
                  <Choice
                    key={s.slug}
                    selected={selected.includes(s.slug)}
                    onClick={() => toggleService(s.slug)}
                    className="text-left"
                  >
                    {s.name}
                  </Choice>
                ))}
              </div>
              {serviceError && (
                <p className="mt-2 text-xs text-red-500">
                  Please select at least one service.
                </p>
              )}
            </fieldset>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink">
                  What type of property is it?
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {propertyTypes.map((p) => (
                    <Choice
                      key={p.value}
                      selected={propertyType === p.value}
                      onClick={() => {
                        setPropertyType(p.value);
                        setPropertyError(false);
                      }}
                    >
                      {p.label}
                    </Choice>
                  ))}
                </div>
                {propertyError && (
                  <p className="mt-2 text-xs text-red-500">
                    Please choose a property type.
                  </p>
                )}
              </fieldset>
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink">
                  How often?
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {frequencies.map((f) => (
                    <Choice
                      key={f.value}
                      selected={frequency === f.value}
                      onClick={() => setFrequency(f.value)}
                    >
                      {f.label}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <TextField
                name="suburb"
                label="Suburb"
                required
                placeholder="e.g. Chatswood"
                rules={{ required: "Please enter your suburb" }}
              />
              <SelectField
                name="budget"
                label="Indicative budget"
                options={budgets}
                placeholder="Select a range (optional)"
              />
              <TextField name="preferredDate" label="Preferred start date" type="date" />
              <TextareaField
                name="message"
                label="Anything else we should know?"
                placeholder="Tell us about the property, access, timing…"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <TextField
                name="name"
                label="Full name"
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
              <div>
                <span className="mb-2 block text-sm font-medium text-ink">
                  Preferred contact method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Choice
                    selected={preferredContact === "phone"}
                    onClick={() => setPreferredContact("phone")}
                  >
                    Phone
                  </Choice>
                  <Choice
                    selected={preferredContact === "email"}
                    onClick={() => setPreferredContact("email")}
                  >
                    Email
                  </Choice>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(s - 1, 0))}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>Get my free quote</>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
