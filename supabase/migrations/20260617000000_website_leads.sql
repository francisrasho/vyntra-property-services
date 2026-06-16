-- Vyntra marketing website — lead intake table.
--
-- This is the ONLY shared touch-point between the public marketing site
-- (vyntra-website) and the Vyntra OS Supabase project. Apply it to the same
-- Supabase project the CRM uses.
--
-- SECURITY MODEL: anonymous/public clients must NOT be able to read or write
-- core CRM tables. The marketing site never talks to Supabase from the browser;
-- it inserts via a server-side Route Handler using the service-role key (which
-- bypasses RLS). RLS is therefore enabled with NO public policy, so the table
-- is locked down to server-side writes and authenticated CRM staff reads only.
--
-- Staff triage these rows inside Vyntra OS and convert them into a client +
-- quote (a Phase 2 screen in the OS app).

create table if not exists public.website_leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  source          text not null,             -- quote_form | contact_form | instant_estimate | exit_intent
  name            text,
  email           text,
  phone           text,
  service         text,
  property_type   text,                       -- commercial | strata | office | residential | other
  budget          text,
  suburb          text,
  message         text,
  preferred_contact text,                     -- phone | email
  estimate_low    numeric,
  estimate_high   numeric,
  meta            jsonb not null default '{}'::jsonb,
  status          text not null default 'new' -- new | contacted | quoted | won | lost
);

create index if not exists website_leads_created_at_idx
  on public.website_leads (created_at desc);
create index if not exists website_leads_status_idx
  on public.website_leads (status);

-- Lock the table down. The service-role key used by the website's API route
-- bypasses RLS, so no INSERT policy is required for the site to work.
alter table public.website_leads enable row level security;

-- Allow authenticated CRM staff to read leads inside Vyntra OS.
-- (Adjust the role/claim to match your Vyntra OS auth model if needed.)
drop policy if exists "Staff can read website leads" on public.website_leads;
create policy "Staff can read website leads"
  on public.website_leads
  for select
  to authenticated
  using (true);

-- NOTE: intentionally NO anon/public INSERT or SELECT policy.
