# Vyntra Property Services — Marketing Website

A premium, conversion-focused marketing website for **Vyntra Property Services**
(Sydney property maintenance & cleaning). Built to generate qualified leads for
property managers, strata managers, commercial businesses and homeowners.

> This is the public **marketing site**. It is a separate project from
> **Vyntra OS** (the internal Supabase CRM in `../vyntra-property-services`).
> The two share **only** the Supabase project, used as the lead destination.

## Tech stack

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion ·
react-hook-form + zod · @supabase/supabase-js · lucide-react · Vitest.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

Scripts:

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest unit tests |

## Environment variables

See `.env.example`. The site runs fully in **demo mode** with no configuration —
leads are validated and logged but not persisted.

| Variable | Purpose |
|---|---|
| `LEAD_SINK` | `log` (demo — default) or `supabase` (persist leads) |
| `SUPABASE_URL` | Vyntra OS Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Never expose to the browser, never commit. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for metadata, sitemap, JSON-LD) |
| `NEXT_PUBLIC_PORTAL_URL` | (Optional, future) Vyntra OS portal login URL |

## Lead pipeline

Every form (multi-step quote wizard, contact form, instant estimate, exit-intent)
POSTs to a single Next.js Route Handler at [`app/api/lead/route.ts`](app/api/lead/route.ts):

1. Validates the payload with zod ([`lib/schema.ts`](lib/schema.ts)).
2. Drops spam silently via a honeypot field.
3. **Demo mode** (`LEAD_SINK=log`): logs the lead to the server console.
4. **Live mode** (`LEAD_SINK=supabase`): inserts into `public.website_leads`
   using the **service-role key** (server-side only — see
   [`lib/supabase.ts`](lib/supabase.ts)).

### Going live (persisting leads to Vyntra OS Supabase)

> ⚠️ This writes to your live database. It requires **your** Supabase
> credentials and your explicit go-ahead — it is **not** done automatically.

1. Apply the migration to the **Vyntra OS Supabase project** (the same project
   the CRM uses):
   - `supabase/migrations/20260617000000_website_leads.sql`
   - via the Supabase CLI (`supabase db push`) or by pasting the SQL into the
     Supabase SQL editor.
   - It creates a locked-down `website_leads` table (RLS enabled, **no** public
     policy — writes happen only via the server-side service-role key).
2. Set `LEAD_SINK=supabase`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in
   `.env.local` (and in your Vercel project env for production).
3. Submit a test lead. It will appear in `public.website_leads`, ready for staff
   to triage and convert into a client/quote inside Vyntra OS.

## Swapping placeholder content for real details

All content lives in typed modules under [`data/`](data) — edit these in one
place and the whole site updates:

- [`data/company.ts`](data/company.ts) — **phone, email, address, hours, ABN, socials** (all marked `TODO`).
- [`data/services.ts`](data/services.ts) — the 9 services + copy.
- [`data/testimonials.ts`](data/testimonials.ts) — replace with real, attributable reviews.
- [`data/caseStudies.ts`](data/caseStudies.ts) / [`data/gallery.ts`](data/gallery.ts) — swap the `picsum.photos` placeholder imagery for real project photography.
- [`data/serviceAreas.ts`](data/serviceAreas.ts), [`data/faqs.ts`](data/faqs.ts).

## Deployment

The site is **Vercel-ready** (static-first; one server route for leads). Set the
environment variables above in the Vercel project. The portal buttons in the nav
footer are intentional "coming soon" placeholders until `NEXT_PUBLIC_PORTAL_URL`
is wired to the Vyntra OS app.

## Phase 2 (not built here)

Client / contractor / admin portals (these are **Vyntra OS**), blog/CMS, live
chat, careers + subcontractor application backends, and real file-attachment
storage for the contact form's upload field (currently present as UI only).
