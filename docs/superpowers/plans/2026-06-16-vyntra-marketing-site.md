# Vyntra Marketing Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, conversion-focused Next.js 15 marketing website for Vyntra Property Services, with a working lead pipeline into the existing Vyntra OS Supabase.

**Architecture:** Static-first App Router site. Typed content in `data/`. A design system of reusable UI primitives + Framer Motion variants (reduced-motion aware). Presentational sections compose pages. The only server code is one lead API route that validates with zod and inserts into a locked-down `website_leads` Supabase table (with a log-only demo fallback so the site runs without credentials).

**Tech Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · react-hook-form + zod · @supabase/supabase-js · lucide-react · Vitest (unit tests for logic).

**Spec:** `docs/superpowers/specs/2026-06-16-vyntra-marketing-site-design.md`

**Conventions for every task:** small focused files; `prefers-reduced-motion` respected by all motion; brand tokens only (no hardcoded hex in components); `tsc --noEmit` + `eslint` clean before commit; conventional commit messages.

---

### Task 0: Project scaffold, brand tokens, base layout

**Goal:** A running Next.js 15 + TS + Tailwind v4 app with the Vyntra brand tokens, Inter font, and a base layout shell.

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `.eslintrc`/`eslint.config.mjs`
- Create: `app/layout.tsx`, `app/page.tsx` (temporary placeholder), `app/globals.css`
- Create: `lib/cn.ts` (className merge helper)
- Create: `.env.example`

**Acceptance Criteria:**
- [ ] `npm run dev` serves a page at `http://localhost:3000` with no console errors.
- [ ] `npm run build` succeeds.
- [ ] Brand tokens (`--color-ink #0F172A`, `--color-gold #D4AF37`, `--color-bg #F8FAFC`, white) are available as Tailwind utilities (e.g. `bg-ink`, `text-gold`).
- [ ] Inter font loads via `next/font`.

**Verify:** `npm run build` → "Compiled successfully"; `npm run dev` then load `/` → renders, zero console errors.

**Steps:**

- [ ] **Step 1: Scaffold.** Run `npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*" --no-turbopack` in `C:\Users\User\Downloads\vyntra-website` (folder already has `.git`, `.gitignore`, `docs/` — accept overwrite of `.gitignore` is fine, keep our env-ignore lines). Then `npm i framer-motion react-hook-form zod @hookform/resolvers @supabase/supabase-js lucide-react clsx tailwind-merge` and `npm i -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`.

- [ ] **Step 2: `lib/cn.ts`** —
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

- [ ] **Step 3: Brand tokens in `app/globals.css`** (Tailwind v4 `@theme`) —
```css
@import "tailwindcss";

@theme {
  --color-ink: #0F172A;
  --color-ink-700: #1E293B;
  --color-gold: #D4AF37;
  --color-gold-soft: #E7CB6B;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

:root { color-scheme: light; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
}
body { background: var(--color-bg); color: var(--color-ink); }
```

- [ ] **Step 4: `app/layout.tsx`** — load Inter via `next/font/google` exposing `--font-inter`, set `<html lang="en">`, base metadata (title template `%s · Vyntra Property Services`, description), render `{children}`. (Nav/Footer added in Task 3.)

- [ ] **Step 5: `.env.example`** —
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LEAD_SINK=log
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PORTAL_URL=
```

- [ ] **Step 6: Verify & commit.** `npm run build`; then `git add -A && git commit -m "chore: scaffold Next.js 15 app with Vyntra brand tokens"`.

---

### Task 1: UI primitives & motion system

**Goal:** Reusable, brand-consistent UI building blocks and motion variants used by every section.

**Files:**
- Create: `lib/motion.ts`, `components/ui/Container.tsx`, `Button.tsx`, `GlassCard.tsx`, `SectionHeading.tsx`, `Badge.tsx`, `Reveal.tsx`, `AnimatedCounter.tsx`, `Modal.tsx`
- Test: `tests/animated-counter.test.tsx` (counter reaches target), `tests/button.test.tsx` (variant classes + asChild link)

**Acceptance Criteria:**
- [ ] `Button` supports `variant` (`primary` gold, `secondary` navy, `ghost`) and `size`, renders as `<a>` when `href` given.
- [ ] `Reveal` animates children in on scroll via `whileInView` and is a no-op under reduced motion.
- [ ] `AnimatedCounter` counts from 0 to a target when in view and stops at target.
- [ ] `GlassCard` renders frosted-glass surface (backdrop-blur, subtle border/shadow).
- [ ] Tests pass.

**Verify:** `npx vitest run tests/animated-counter.test.tsx tests/button.test.tsx` → all pass; `npm run build` clean.

**Steps:**

- [ ] **Step 1: `lib/motion.ts`** — export shared variants and a reduced-motion-safe helper:
```ts
import type { Variants } from "framer-motion";
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger: Variants = { show: { transition: { staggerChildren: 0.08 } } };
export const viewport = { once: true, margin: "-80px" } as const;
```

- [ ] **Step 2: Write `Reveal.tsx`** — wraps children in `motion.div` with `variants={fadeUp}`, `initial="hidden"`, `whileInView="show"`, `viewport={viewport}`; uses `useReducedMotion()` to skip animation (render plain `div`).

- [ ] **Step 3: Write `AnimatedCounter.tsx`** — `useInView` + `useMotionValue`/`animate` to count to `value`; supports `suffix`/`prefix`; under reduced motion, render final value immediately. Then write `tests/animated-counter.test.tsx` asserting final rendered text equals target; run `npx vitest run` (red→green).

- [ ] **Step 4: Write `Button.tsx`** — variants via `cn`; `href` → `<a>` (or Next `Link`), else `<button>`. Write `tests/button.test.tsx` asserting variant class + anchor rendering; run vitest (red→green).

- [ ] **Step 5: Write `Container`, `GlassCard`, `SectionHeading`, `Badge`, `Modal`** (Modal: focus-trap-lite, `Esc` to close, backdrop blur, portal). Match the design system.

- [ ] **Step 6: Verify & commit.** `npx vitest run` + `npm run build`; commit `feat: add UI primitives and motion system`.

---

### Task 2: Typed content data layer

**Goal:** Single source of truth for all site content as typed TS modules with placeholder-but-realistic copy.

**Files:**
- Create: `data/types.ts`, `data/company.ts`, `data/services.ts`, `data/stats.ts`, `data/whyChoose.ts`, `data/testimonials.ts`, `data/caseStudies.ts`, `data/serviceAreas.ts`, `data/faqs.ts`
- Test: `tests/data.test.ts` (invariants: 9 services, unique slugs, required fields present)

**Acceptance Criteria:**
- [ ] `services.ts` has exactly the 9 services with unique `slug`, `name`, `icon` (lucide name), `tagline`, `description`, `benefits[]`, `problem`, `solution`, `process[]`.
- [ ] `company.ts` centralizes name, phone, email, hours, address, socials — placeholder values clearly marked `// TODO: real value`.
- [ ] All modules strongly typed via `data/types.ts`; `tsc` clean.
- [ ] `tests/data.test.ts` passes.

**Verify:** `npx vitest run tests/data.test.ts` → pass; `npm run build` clean.

**Steps:**

- [ ] **Step 1: `data/types.ts`** — define interfaces: `Service`, `CaseStudy`, `Testimonial`, `ServiceArea`, `Faq`, `Stat`, `WhyReason`, `Company`. Example:
```ts
export interface Service {
  slug: string; name: string; icon: string; tagline: string;
  description: string; problem: string; solution: string;
  benefits: string[]; process: { title: string; detail: string }[];
}
```
- [ ] **Step 2:** Populate the 9 services (Commercial Cleaning, Office Cleaning, Strata Cleaning, Property Maintenance, Handyman Services, Pressure Washing, Garden Maintenance, End of Lease Cleaning, Emergency Property Support) with conversion-grade copy.
- [ ] **Step 3:** Populate `stats.ts` (500+ Projects, 98% Satisfaction, 24 Hour Response, Sydney Wide), `whyChoose.ts` (Reliable, Professional, Fully Insured, Fast Communication, Technology Powered, Transparent Pricing, Quality Control, Long-Term Relationships), `testimonials.ts` (≥6, placeholder names flagged), `caseStudies.ts` (≥3 with problem/solution/results/beforeAfter image refs/testimonial), `serviceAreas.ts` (Sydney regions + suburbs + response time + svg coords), `faqs.ts` (≥8).
- [ ] **Step 4:** Write `tests/data.test.ts` (assert 9 services, unique slugs, non-empty required fields). Run vitest (red→green).
- [ ] **Step 5: Commit** `feat: add typed content data layer`.

---

### Task 3: Layout chrome — nav, footer, floating CTAs

**Goal:** Sticky glass navigation, mobile menu, footer, persistent floating quote button, and sticky mobile call bar.

**Files:**
- Create: `components/layout/GlassNav.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `FloatingQuoteButton.tsx`, `MobileCallBar.tsx`, `components/layout/Logo.tsx`
- Modify: `app/layout.tsx` (mount nav, footer, floating CTAs)

**Acceptance Criteria:**
- [ ] Nav is sticky, becomes frosted-glass after scroll (transparent over hero, solid-glass after ~80px).
- [ ] Nav links: Home, Services, About, Why Choose Us (anchor `/#why`), Service Areas, Gallery, Case Studies, FAQ (anchor `/#faq`), Contact + a gold "Get Quote" button.
- [ ] Mobile menu: accessible slide-in panel, `Esc`/backdrop close, focus trapped.
- [ ] Floating "Get Quote" button visible on all pages (desktop) and sticky tap-to-call bar on mobile (uses `company.phone`).
- [ ] Footer: brand, nav, service list, contact, "Client/Contractor Portal — coming soon" disabled chips, socials, legal.

**Verify:** `npm run dev` → scroll changes nav style; resize to mobile shows call bar + working menu; `npm run build` clean.

**Steps:**
- [ ] **Step 1:** `Logo.tsx` (wordmark "VYNTRA" + gold mark, lucide or inline SVG).
- [ ] **Step 2:** `GlassNav.tsx` — `useScroll`/scroll listener toggles glass class; renders desktop links + Get Quote (opens quote modal — wire in Task 5, expose `onQuote` via a context or a global event for now).
- [ ] **Step 3:** `MobileMenu.tsx` — animated panel (framer-motion), accessible.
- [ ] **Step 4:** `FloatingQuoteButton.tsx` + `MobileCallBar.tsx`.
- [ ] **Step 5:** `Footer.tsx` with coming-soon portal chips.
- [ ] **Step 6:** Mount all in `app/layout.tsx`. Verify responsive; commit `feat: add navigation, footer, and floating CTAs`.

---

### Task 4: Lead pipeline core (schema, supabase, API route, estimate) — TESTED

**Goal:** A validated lead intake endpoint that inserts into Supabase or logs in demo mode, plus the instant-estimate calculation, all unit-tested.

**Files:**
- Create: `lib/schema.ts` (zod), `lib/supabase.ts` (server client), `lib/estimate.ts`, `app/api/lead/route.ts`
- Test: `tests/schema.test.ts`, `tests/estimate.test.ts`, `tests/lead-route.test.ts`

**Acceptance Criteria:**
- [ ] `leadSchema` validates/normalizes all form payloads; rejects missing required fields and bad email/phone; honeypot field `company_website` must be empty.
- [ ] `estimateRange(service, propertySize, frequency)` returns `{ low, high }` deterministic numbers.
- [ ] `POST /api/lead` returns `{ ok: true }` for valid input in `LEAD_SINK=log` (no network) and `{ ok: false, errors }` (400) for invalid input.
- [ ] When `LEAD_SINK=supabase`, the route calls the supabase insert (mocked in test) with mapped columns.
- [ ] All tests pass.

**Verify:** `npx vitest run tests/schema.test.ts tests/estimate.test.ts tests/lead-route.test.ts` → all pass.

**Steps:**
- [ ] **Step 1: `lib/schema.ts`** —
```ts
import { z } from "zod";
export const leadSchema = z.object({
  source: z.enum(["quote_form","contact_form","instant_estimate","exit_intent"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  service: z.string().optional().default(""),
  propertyType: z.enum(["commercial","strata","office","residential","other"]).optional(),
  budget: z.string().optional().default(""),
  suburb: z.string().optional().default(""),
  message: z.string().optional().default(""),
  preferredContact: z.enum(["phone","email"]).default("phone"),
  estimateLow: z.number().nullable().optional(),
  estimateHigh: z.number().nullable().optional(),
  company_website: z.string().max(0).optional(), // honeypot: must be empty
  meta: z.record(z.string(), z.any()).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;
```
Write `tests/schema.test.ts` (valid passes; missing name fails; bad email fails; non-empty honeypot fails). Run vitest (red→green).

- [ ] **Step 2: `lib/estimate.ts`** — pure function with a rate table per service + size multiplier + frequency discount returning `{low, high}`. Write `tests/estimate.test.ts` asserting known inputs → known ranges and `low <= high`. Run vitest (red→green).

- [ ] **Step 3: `lib/supabase.ts`** —
```ts
import { createClient } from "@supabase/supabase-js";
export function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
```

- [ ] **Step 4: `app/api/lead/route.ts`** —
```ts
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schema";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.company_website) return NextResponse.json({ ok: true }); // silent honeypot
  const sink = process.env.LEAD_SINK ?? "log";
  if (sink === "supabase") {
    const sb = getServiceClient();
    if (sb) {
      const d = parsed.data;
      const { error } = await sb.from("website_leads").insert({
        source: d.source, name: d.name, email: d.email, phone: d.phone,
        service: d.service, property_type: d.propertyType, budget: d.budget,
        suburb: d.suburb, message: d.message, preferred_contact: d.preferredContact,
        estimate_low: d.estimateLow ?? null, estimate_high: d.estimateHigh ?? null,
        meta: d.meta ?? {},
      });
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  } else {
    console.info("[lead:demo]", JSON.stringify(parsed.data));
  }
  return NextResponse.json({ ok: true });
}
```
Write `tests/lead-route.test.ts`: import `POST`, call with a `Request` in log mode → 200 `{ok:true}`; invalid → 400; honeypot set → 200 without insert. Run vitest (red→green).

- [ ] **Step 5: Commit** `feat: add tested lead pipeline (schema, estimate, api route)`.

---

### Task 5: Forms — contact, multi-step quote, instant estimate, exit-intent

**Goal:** All lead-capture UIs, wired to `/api/lead`, with premium UX and success states.

**Files:**
- Create: `components/forms/useLeadSubmit.ts`, `Field.tsx`, `ContactForm.tsx`, `QuoteForm.tsx` (multi-step), `InstantEstimate.tsx`, `ExitIntentPopup.tsx`, `QuoteModalProvider.tsx`
- Modify: `app/layout.tsx` (mount `QuoteModalProvider` + `ExitIntentPopup`), `GlassNav`/`FloatingQuoteButton` (trigger modal)
- Test: `tests/quote-form.test.tsx` (step validation blocks advance; full flow calls submit)

**Acceptance Criteria:**
- [ ] `useLeadSubmit` posts to `/api/lead`, exposes `status` (`idle|submitting|success|error`).
- [ ] `QuoteForm` is 4 steps with progress bar; cannot advance a step with invalid fields; final submit posts `source:"quote_form"`.
- [ ] `ContactForm` has all spec fields incl. file-upload UI (clearly non-persisted) + preferred contact; posts `source:"contact_form"`.
- [ ] `InstantEstimate` computes a live range via `lib/estimate.ts` and can submit as a lead.
- [ ] `ExitIntentPopup` shows once per session on exit-intent (desktop) / scroll-up (mobile), throttled via `localStorage`.
- [ ] Quote modal opens from nav + floating button anywhere.
- [ ] `tests/quote-form.test.tsx` passes.

**Verify:** `npx vitest run tests/quote-form.test.tsx` → pass; manual: submit each form in demo mode → success state; `npm run build` clean.

**Steps:**
- [ ] **Step 1:** `useLeadSubmit.ts` (fetch wrapper + status).
- [ ] **Step 2:** `Field.tsx` (label, input/select/textarea, error text) using react-hook-form context.
- [ ] **Step 3:** `QuoteModalProvider.tsx` — context exposing `openQuote()/closeQuote()`, renders `Modal` with `QuoteForm`.
- [ ] **Step 4:** `QuoteForm.tsx` — 4 steps with zod-per-step (`@hookform/resolvers`), progress bar, back/next, success screen. Write `tests/quote-form.test.tsx`; run vitest (red→green).
- [ ] **Step 5:** `ContactForm.tsx`, `InstantEstimate.tsx`, `ExitIntentPopup.tsx`.
- [ ] **Step 6:** Wire triggers; mount provider + popup in layout. Verify + commit `feat: add lead-capture forms wired to /api/lead`.

---

### Task 6: Home sections — Hero, TrustBar, Stats

**Goal:** The cinematic top of the homepage.

**Files:** Create `components/sections/Hero.tsx`, `TrustBar.tsx`, `Stats.tsx`, `components/ui/Particles.tsx`; Modify `app/page.tsx`.

**Acceptance Criteria:**
- [ ] Full-viewport hero: headline "Sydney's Premium Property Services Partner", subheadline (from brief), three CTAs (Get Free Quote → quote modal, Book a Consultation → `/contact`, Call Now → `tel:`), animated entrance, subtle particles + gradient (reduced-motion safe).
- [ ] Animated trust indicators row: Fully Insured, Professional Contractors, Fast Response Times, Sydney Wide, Quality Guaranteed.
- [ ] Stats use `AnimatedCounter`: 500+ Projects, 98% Satisfaction, 24 Hour Response, Sydney Service Area.
- [ ] Looks premium at mobile/tablet/desktop.

**Verify:** `npm run dev` → hero renders with animation; counters animate once in view; responsive; `npm run build` clean. Commit `feat: add hero, trust bar, and stats sections`.

**Steps:** Build `Particles` (lightweight canvas/CSS, disabled under reduced motion) → `Hero` → `TrustBar` → `Stats`; assemble into `app/page.tsx`; verify; commit.

---

### Task 7: Home sections — Services grid, Why Choose, Case Study feature

**Goal:** Core mid-page conversion sections.

**Files:** Create `components/sections/ServicesGrid.tsx`, `WhyChoose.tsx`, `CaseStudyFeature.tsx`; Modify `app/page.tsx`.

**Acceptance Criteria:**
- [ ] `ServicesGrid` renders all 9 services as premium cards (icon, name, short desc, hover animation, "Learn more" → `/services/[slug]`) from `data/services.ts`.
- [ ] `WhyChoose` renders the 8 reasons with scroll animations and gold accents (dark-navy section).
- [ ] `CaseStudyFeature` highlights one case study (problem→solution→results) with CTA to `/case-studies/[slug]`.
- [ ] Each section ends with a quote CTA.

**Verify:** `npm run dev` → sections render from data, hovers animate, links resolve; `npm run build` clean. Commit `feat: add services grid, why-choose, case-study feature`.

**Steps:** Build each section from data modules; add a reusable `CTASection` stub if needed; verify; commit.

---

### Task 8: Home sections — Gallery preview, Testimonials, FAQ, CTA + assemble

**Goal:** Complete the homepage and lock its final section order with anchors.

**Files:** Create `components/sections/GalleryPreview.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `CTASection.tsx`; Modify `app/page.tsx`.

**Acceptance Criteria:**
- [ ] `GalleryPreview` shows a teaser grid linking to `/gallery`.
- [ ] `Testimonials` renders Google-style review cards (≥6) + a video-testimonial placeholder; carousel or grid.
- [ ] `FAQ` is an accessible accordion with `id="faq"`; `WhyChoose` section carries `id="why"` (anchors used by nav).
- [ ] `CTASection` (reusable) final full-width conversion band with quote + call CTAs.
- [ ] Final home order matches spec §5.

**Verify:** `npm run dev` → full homepage scrolls top-to-bottom premium; nav anchors `/#why` and `/#faq` jump correctly; `npm run build` clean. Commit `feat: complete homepage sections and assembly`.

---

### Task 9: Interactive Sydney service-area map + /service-areas page

**Goal:** Custom animated SVG map of Sydney coverage and the dedicated page.

**Files:** Create `components/sections/ServiceAreaMap.tsx`, `app/service-areas/page.tsx`; Modify `app/page.tsx` (embed map section).

**Acceptance Criteria:**
- [ ] SVG map of Sydney regions with pulsing gold markers from `data/serviceAreas.ts`; hover/tap shows tooltip (region, response time, availability).
- [ ] Reduced-motion disables pulsing.
- [ ] `/service-areas` page: full map + region list + response-time messaging + quote CTA + metadata.
- [ ] Keyboard accessible (markers focusable, tooltip on focus).

**Verify:** `npm run dev` → map interactive on `/` and `/service-areas`; `npm run build` clean. Commit `feat: add interactive Sydney service-area map and page`.

---

### Task 10: Services pages — index + dynamic detail

**Goal:** `/services` index and 9 statically-generated `/services/[slug]` pages.

**Files:** Create `app/services/page.tsx`, `app/services/[slug]/page.tsx`.

**Acceptance Criteria:**
- [ ] `/services` lists all 9 with cards → detail.
- [ ] `[slug]` uses `generateStaticParams` over `data/services.ts`; `generateMetadata` per service (title/description with "<Service> Sydney").
- [ ] Detail layout: hero, problem, solution, benefits, process steps, related services, quote CTA.
- [ ] Unknown slug → `notFound()`.
- [ ] JSON-LD `Service` emitted (helper from Task 14 or inline now).

**Verify:** `npm run build` → 9 service routes prerendered; visit two slugs render correctly; bad slug 404s. Commit `feat: add services index and dynamic service detail pages`.

---

### Task 11: Gallery page — filter, lightbox, before/after slider

**Goal:** Interactive gallery with filtering, fullscreen lightbox, and before/after sliders.

**Files:** Create `app/gallery/page.tsx`, `components/gallery/GalleryGrid.tsx`, `Lightbox.tsx`, `components/ui/BeforeAfterSlider.tsx`; `data/gallery.ts`.
**Test:** `tests/before-after.test.tsx` (slider clamps 0–100, updates clip on input).

**Acceptance Criteria:**
- [ ] Filterable grid by category (Commercial, Strata, Pressure Washing, etc.) with animated layout.
- [ ] Click → fullscreen lightbox (keyboard nav, `Esc` close, focus trap).
- [ ] `BeforeAfterSlider` draggable handle reveals after-image; clamps 0–100; keyboard accessible.
- [ ] `tests/before-after.test.tsx` passes.

**Verify:** `npx vitest run tests/before-after.test.tsx` → pass; manual gallery interactions; `npm run build` clean. Commit `feat: add gallery with filtering, lightbox, before/after slider`.

---

### Task 12: Case studies — index + detail

**Goal:** `/case-studies` index and `/case-studies/[slug]` detail.

**Files:** Create `app/case-studies/page.tsx`, `app/case-studies/[slug]/page.tsx`.

**Acceptance Criteria:**
- [ ] Index lists all case studies (image, title, result metric) → detail.
- [ ] `[slug]` via `generateStaticParams` + `generateMetadata`; layout: Problem → Solution → Results (metrics) → before/after gallery → customer testimonial → quote CTA.
- [ ] Unknown slug → `notFound()`.

**Verify:** `npm run build` → case-study routes prerendered; render check; bad slug 404s. Commit `feat: add case studies index and detail pages`.

---

### Task 13: About, Contact, Quote pages

**Goal:** Remaining pages: brand story, full contact, standalone quote.

**Files:** Create `app/about/page.tsx`, `app/contact/page.tsx`, `app/quote/page.tsx`.

**Acceptance Criteria:**
- [ ] `/about`: premium brand story positioning Vyntra as modern/tech-driven (not small-local), values, "powered by modern systems", CTA.
- [ ] `/contact`: `ContactForm` + business hours + emergency contact block + keyless Google Maps embed iframe (address from `company.ts`) + metadata.
- [ ] `/quote`: hosts `QuoteForm` standalone (same component as modal) with supporting trust copy + metadata.
- [ ] All three have per-page metadata.

**Verify:** `npm run dev` → all three render premium + responsive; contact map loads; quote submits in demo mode; `npm run build` clean. Commit `feat: add about, contact, and quote pages`.

---

### Task 14: SEO infrastructure — metadata, JSON-LD, sitemap, robots

**Goal:** Site-wide SEO/schema, sitemap, robots, OG.

**Files:** Create `lib/seo.ts` (JSON-LD builders), `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (or static OG); Modify `app/layout.tsx` (default metadata + org JSON-LD), service/case-study/FAQ pages (inject schema).

**Acceptance Criteria:**
- [ ] `LocalBusiness` JSON-LD in root with `areaServed` (Sydney) from `company.ts`/`serviceAreas.ts`.
- [ ] `Service` JSON-LD on each service page; `FAQPage` JSON-LD on home FAQ; `BreadcrumbList` on detail pages.
- [ ] `sitemap.ts` enumerates all static + dynamic routes; `robots.ts` allows all + points to sitemap.
- [ ] OpenGraph/Twitter defaults set; keyword-targeted titles/descriptions present.

**Verify:** `npm run build` → `/sitemap.xml` + `/robots.txt` generated; view-source of a service page shows valid JSON-LD (validate shape in a quick `tests/seo.test.ts`). Commit `feat: add SEO metadata, JSON-LD schema, sitemap, robots`.

---

### Task 15: Supabase `website_leads` migration + env/docs (apply gated on user)

**Goal:** Deliver the DB migration and developer docs so leads persist once the user supplies credentials.

**Files:** Create `supabase/migrations/2026XXXX_website_leads.sql`, `README.md` (project), update `.env.example` comments.

**Acceptance Criteria:**
- [ ] Migration creates `website_leads` per spec §6 with `gen_random_uuid()` pk, all columns, `status default 'new'`, RLS enabled, and NO public/anon policy (service-role-only writes).
- [ ] `README.md` documents: install/run, env vars, demo (`LEAD_SINK=log`) vs live (`supabase`), how to apply the migration to the Vyntra OS Supabase, and the placeholder-content swap points.
- [ ] Plan/README clearly state applying to the live DB requires the user's credentials + explicit go-ahead (NOT done automatically here).

**Verify:** SQL parses (review); `README` steps are complete and accurate. Commit `feat: add website_leads migration and project docs`.

**Steps:**
- [ ] **Step 1:** Write migration:
```sql
create table if not exists public.website_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  name text, email text, phone text,
  service text, property_type text, budget text, suburb text,
  message text, preferred_contact text,
  estimate_low numeric, estimate_high numeric,
  meta jsonb not null default '{}'::jsonb,
  status text not null default 'new'
);
alter table public.website_leads enable row level security;
-- intentionally NO anon/public policy: inserts happen via service-role key only.
```
- [ ] **Step 2:** Write `README.md`. **Step 3:** Commit.

---

### Task 16: Final verification — build, lint, types, Lighthouse, responsive QA

**Goal:** Prove the whole site is production-ready.

**Files:** Modify as needed for fixes only.

**Acceptance Criteria:**
- [ ] `npm run build` clean; `npx tsc --noEmit` clean; `npm run lint` clean; `npx vitest run` all green.
- [ ] Manual responsive pass (mobile/tablet/desktop) of home + one service + contact via preview screenshots, no layout breakage, no console errors.
- [ ] Lighthouse (production build) on `/` and one service page: Performance/SEO/Best-Practices/Accessibility ≥ 90 (target ≥ 95); record scores.
- [ ] All forms reach success state in demo mode.

**Verify:** Run all commands above; capture Lighthouse scores + screenshots; list any follow-ups. Commit `chore: final verification and polish`.

---

## Open items requiring the user (carried from spec §13)

1. Supabase `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` and go-ahead to apply the `website_leads` migration to the live Vyntra OS DB (until then: demo mode).
2. Real business details + testimonials/photos (placeholders until then).
3. Future Vyntra OS portal URL.
4. Confirm File Upload stays as non-persisted UI in Phase 1.
