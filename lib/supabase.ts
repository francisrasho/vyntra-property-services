import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-only Supabase client using the service-role key. Returns null when
 *  credentials aren't configured (e.g. demo mode), so callers degrade safely.
 *  NEVER import this into client components — the service-role key must stay
 *  on the server. */
export function getServiceClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
