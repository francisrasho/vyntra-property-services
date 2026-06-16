# Vyntra Property Services — Premium Marketing Website (Phase 1)

**Date:** 2026-06-16
**Status:** Approved design — pending spec review
**Author:** Francis (with Claude)
**Location:** `C:\Users\User\Downloads\vyntra-website` (standalone)

---

## 1. Purpose & Objective

Build a world-class, conversion-focused public marketing website for **Vyntra
Property Services** — a Sydney premium property maintenance & cleaning company.
The site must look and feel like Apple / Stripe / Tesla / luxury real-estate
brands and exists to **generate qualified leads** for property managers, strata
managers, commercial businesses, landlords and homeowners.

Single visitor takeaway: *"These people are clearly the best — I don't need to
look anywhere else."*

Primary success metrics:

- Visitor → lead conversion (quote / contact / estimate submissions).
- Trust & authority perception (premium visual quality, social proof).
- Technical excellence: near-perfect Lighthouse, strong local SEO, fast loads.

---

## 2. Scope

### In scope (Phase 1)

A premium **marketing site** comprising a cinematic homepage with all marketing
sections, dedicated service pages, supporting pages (About, Service Areas,
Gallery, Case Studies, Contact), and a **working lead pipeline** that writes into
the existing Vyntra OS Supabase.

### Explicitly deferred (Phase 2+, NOT built now)

- Client / contractor / admin **portals** → already exist as **Vyntra OS** (separate app). Marketing nav shows tasteful "coming soon" states linking nowhere yet.
- Blog / CMS, live chat, careers + subcontractor application backends.
- Real file-attachment storage for the contact form (field present as UI; see §7).

### Relationship to "Vyntra OS"

`vyntra-website` is a **separate Next.js project** from the existing
`vyntra-property-services` (Vyntra OS — a Vite + React + Supabase CRM). They share
**only** the Supabase project, used as the lead destination. The marketing site
does not import OS code and does not modify OS application code. The one shared
touch-point is a new Supabase migration (`website_leads`) — see §6.

---

## 3. Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSG/SSR for SEO + speed |
| Language | **TypeScript** (strict) | |
| Styling | **Tailwind CSS v4** | `@theme` brand tokens |
| Animation | **Framer Motion** (`motion`) | scroll reveals, counters, transitions |
| Forms | **react-hook-form + zod** | per-step validation |
| Icons | **lucide-react** | matches Vyntra OS convention |
| Data layer (leads) | **@supabase/supabase-js** | server-side, service-role key |
| Content | typed TS data modules in `data/` | CMS-swappable later |
| Hosting | **Vercel-ready** | static-first, one server route |

Rendering strategy: all marketing pages are statically rendered (SSG). The only
server code is the lead API route handler.

---

## 4. Brand & Design System

**Palette** (from brief):

- Primary / ink: `#0F172A` (dark navy)
- Secondary / accent: `#D4AF37` (gold)
- Surface white: `#FFFFFF`
- Background: `#F8FAFC`
- Supporting neutrals (slate scale) for text hierarchy.

**Theme model:** light base (`#F8FAFC` background, white glass cards, navy text)
punctuated by **dramatic dark-navy sections** (`#0F172A`) with gold accents for
contrast and rhythm — the Apple/Stripe approach. **No dark-mode toggle** (the
literal "Dark Mode" line item is satisfied by the dark sections).

**Typography:** Inter (already used in Vyntra OS — keeps brand consistent).
Display weights for headlines, tight tracking, generous scale. Clear type scale
(display / h1–h4 / body / caption).

**Visual language:**

- Glassmorphism (frosted nav + cards), soft gradients, subtle grain/noise.
- Generous whitespace, restrained palette, gold used sparingly as a premium accent.
- Micro-animations, scroll reveals, animated counters, light parallax, subtle hero particles.
- **All motion gated behind `prefers-reduced-motion`.**

**Imagery:** high-quality placeholder imagery (clearly swappable). A single
`data/company.ts` holds placeholder phone/email/hours/socials marked `TODO` so
real details swap in one place.

---

## 5. Information Architecture (Pages)

| Route | Purpose |
|---|---|
| `/` | Cinematic home: hero → trust bar → animated stats → services grid → why-choose → featured case study → gallery teaser → **interactive Sydney service-area map** → testimonials → FAQ → final CTA |
| `/services` | Services index (9 cards) |
| `/services/[slug]` | 9 dedicated service pages: problem/solution copy, benefits, process, CTA, JSON-LD `Service` |
| `/about` | Brand story — modern, tech-driven property company (not "small local business") |
| `/service-areas` | Full interactive map + suburb coverage + response times |
| `/gallery` | Filterable grid, lightbox, before/after sliders |
| `/case-studies` | Index of project showcases |
| `/case-studies/[slug]` | Problem → Solution → Results → before/after → testimonial |
| `/contact` | Full contact form + keyless Google Maps embed + hours + emergency line |
| `/quote` | Standalone host for the multi-step quote wizard (same component used in the modal) |

**Navigation:** Home, Services, About, Why Choose Us (home anchor), Service Areas,
Gallery, Case Studies, FAQ (home anchor), Contact. "Why Choose Us" and "FAQ" are
home-page sections reached via smooth-scroll anchors to keep the nav clean.

**The 9 services:** Commercial Cleaning, Office Cleaning, Strata Cleaning,
Property Maintenance, Handyman Services, Pressure Washing, Garden Maintenance,
End of Lease Cleaning, Emergency Property Support.

---

## 6. Lead Pipeline (the core conversion mechanic)

**Destination:** the existing Vyntra OS **Supabase** project.

**Security-first design:** anonymous public writes must NOT touch core CRM tables
(`clients`, `quotes`, …). Instead, add a dedicated, locked-down intake table.

### New Supabase migration — `website_leads`

A new migration is added to the **Vyntra OS** Supabase (canonical DB location).
This is the only shared touch-point and **requires the user's approval +
credentials before applying** (it changes the live database).

Proposed columns (final SQL refined against actual `clients`/`quotes` columns at
implementation time):

```
id            uuid pk default gen_random_uuid()
created_at    timestamptz default now()
source        text         -- 'quote_form' | 'contact_form' | 'instant_estimate' | 'exit_intent'
name          text
email         text
phone         text
service       text         -- requested service(s)
property_type text         -- commercial | strata | office | residential | other
budget        text
suburb        text
message       text
preferred_contact text     -- phone | email
estimate_low  numeric null -- from instant estimate
estimate_high numeric null
meta          jsonb        -- raw payload / UTM / page
status        text default 'new'  -- staff triage in Vyntra OS
```

**RLS:** Row Level Security enabled, **no anon/public policy** (table is not
client-writable). Writes happen server-side via the service-role key, which
bypasses RLS. A later Vyntra OS Phase-2 screen lists `website_leads` for staff to
triage and convert into a `client` + `quote`.

### Submission flow

1. All forms (multi-step quote, contact, instant-estimate, exit-intent) POST to a
   single Next.js Route Handler: `app/api/lead/route.ts`.
2. The route validates with **zod**, applies a honeypot + basic anti-spam check.
3. On success it inserts into `website_leads` using `@supabase/supabase-js` with
   the **service-role key** (server-only env var — never shipped to the client).
4. Returns `{ ok: true }`; the form shows a premium success state.

**Graceful degradation:** if Supabase env vars are absent (e.g. fresh clone before
the user adds keys), the route logs the payload and returns success, so the site
is fully demoable without credentials. Controlled by an env flag.

### Environment variables (`.env.example` provided)

```
SUPABASE_URL=                 # from Vyntra OS Supabase project
SUPABASE_SERVICE_ROLE_KEY=    # server-only, never commit, never NEXT_PUBLIC_
LEAD_SINK=supabase            # 'supabase' | 'log' (log = demo mode)
NEXT_PUBLIC_PORTAL_URL=       # optional future Vyntra OS login URL (portals)
```

`.env.local` is gitignored; the service-role key is never exposed to the browser
and never committed.

---

## 7. Lead-Gen Conversion Layer

- Floating **"Get Quote"** button (all pages, persistent).
- Sticky **mobile call bar** (tap-to-call).
- **Multi-step quote wizard**: launched as a **modal** from the floating Get Quote button and section CTAs, and **also available as a standalone `/quote` page** (for direct links + SEO). Step 1 service(s) → Step 2 property type + size/frequency → Step 3 details (suburb, preferred date, message) → Step 4 contact info + preferred method. Progress bar, per-step validation, back/next.
- **Instant estimate calculator** (self-contained, indicative ranges by service + property size).
- **Exit-intent popup** (lightweight, dismissible, throttled via localStorage).
- CTAs repeated after every major section; tasteful urgency microcopy.
- **Contact form fields:** Name, Phone, Email, Service Required, Property Type,
  Budget, Message, Preferred Contact Method, **File Upload** (present as UI;
  attachments are NOT persisted in Phase 1 — needs storage; clearly flagged).

---

## 8. Component Architecture

```
app/
  layout.tsx            # fonts, metadata defaults, nav/footer, JSON-LD org
  template.tsx          # page transitions
  page.tsx              # home
  services/page.tsx, services/[slug]/page.tsx
  about/page.tsx
  service-areas/page.tsx
  gallery/page.tsx
  case-studies/page.tsx, case-studies/[slug]/page.tsx
  contact/page.tsx
  quote/page.tsx        # standalone quote wizard host
  api/lead/route.ts     # the only server code
  sitemap.ts, robots.ts
components/
  layout/   GlassNav, MobileMenu, Footer, FloatingQuoteButton, MobileCallBar
  sections/ Hero, TrustBar, Stats, ServicesGrid, WhyChoose, CaseStudyFeature,
            GalleryPreview, ServiceAreaMap, Testimonials, FAQ, CTASection
  ui/       Button, GlassCard, SectionHeading, Container, Reveal,
            AnimatedCounter, BeforeAfterSlider, Modal, Badge
  forms/    QuoteForm (multi-step), ContactForm, InstantEstimate, fields
lib/        supabase.ts (server), schema.ts (zod), seo.ts (JSON-LD helpers),
            motion.ts (variants + reduced-motion)
data/       services.ts, caseStudies.ts, testimonials.ts, serviceAreas.ts,
            faqs.ts, company.ts, stats.ts, whyChoose.ts
```

Each unit has one clear purpose, a typed interface, and is independently testable.
Content lives in typed `data/` modules (single source of truth, CMS-swappable).

---

## 9. Interactive Sydney Map

A **custom animated SVG** of Sydney regions (not Google Maps) with pulsing gold
markers and hover/tap tooltips showing coverage + response times — zero API keys,
more premium than a raw embed, fully themeable. Data from `data/serviceAreas.ts`.
The `/contact` page additionally embeds a **keyless Google Maps iframe** for the
literal business address.

---

## 10. SEO & Performance

- Next.js **Metadata API** per page; `generateMetadata` for dynamic routes.
- **JSON-LD schema:** `LocalBusiness` (with `areaServed`), `Service` per service,
  `FAQPage`, `BreadcrumbList`.
- `sitemap.ts`, `robots.ts`, canonical URLs, OpenGraph + Twitter cards.
- Target keywords woven into copy + metadata: *Property Maintenance Sydney,
  Commercial Cleaning Sydney, Strata Cleaning Sydney, Office Cleaning Sydney,
  Handyman Sydney, Cleaning Services Sydney*.
- Performance: SSG, `next/image` with sized/lazy images, font preconnect +
  `display=swap`, minimal client JS, code-split heavy widgets. Target Lighthouse
  ≥ 95 across the board.

---

## 11. Copywriting

Expert conversion copy throughout — every section builds trust and drives action.
Vyntra positioned as a **modern, technology-driven premium brand**, not a small
local operator. Placeholder business specifics (phone, email, testimonials,
suburbs) clearly marked for swap in `data/`.

---

## 12. Testing & Verification

- `tsc --noEmit` (strict) clean; `eslint` clean.
- `next build` succeeds; static export of all routes.
- Manual preview verification (dev server + screenshots) of each major section,
  responsive (mobile/tablet/desktop), and reduced-motion.
- **Lead flow test:** submit each form in `LEAD_SINK=log` demo mode (asserts
  payload shape) and, once creds provided, a live insert into `website_leads`.
- Lighthouse pass on home + a service page.

---

## 13. Open Items / Inputs Needed From User

1. **Supabase credentials** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and
   approval to apply the `website_leads` migration to the live DB. Until then the
   site runs in `log` demo mode.
2. Real business details (phone, email, hours, address, ABN, service suburbs) and
   any real testimonials / case studies / photos — placeholders used until then.
3. Future Vyntra OS portal URL (for when "coming soon" becomes a real link).
4. Confirm "File Upload" stays as non-persisted UI in Phase 1 (vs. dropped).

---

## 14. Risks & Decisions Log

- **Anon writes to CRM = security risk** → mitigated with dedicated, RLS-locked
  `website_leads` table written only via server-side service-role key.
- **Scope creep** (portals/blog/chat) → explicitly deferred; nav placeholders only.
- **Shared DB touch-point** → single migration, user-approved, applied to OS Supabase.
- **No real assets yet** → placeholder strategy centralised in `data/` for one-place swap.
- **Map dependency** → custom SVG avoids Google Maps API key dependency.
