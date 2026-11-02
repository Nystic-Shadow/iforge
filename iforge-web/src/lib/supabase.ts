import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase is optional: when the env vars aren't set, the site falls back to the
// code defaults in siteData.ts and the admin panel runs in read-only preview.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Without the service-role key, writes go through the anon key and RLS refuses them. */
export const hasServiceRoleKey = Boolean(serviceKey);

/** Public (read) client — safe for reading published content. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Admin (write) client using the service-role key. Server-only — never import
 * this into a Client Component. Falls back to the anon client if no service key
 * is set (writes will then depend on RLS policies).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  // Same condition as reads, so writes never land somewhere reads don't look.
  if (!url || !anonKey) return null;
  return createClient(url, serviceKey || anonKey, { auth: { persistSession: false } });
}

// The single row that holds the whole editable site document.
export const CONTENT_TABLE = "site_content";
export const CONTENT_ID = "main";
