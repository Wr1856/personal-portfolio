import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let cached: SupabaseClient<Database> | null = null;

/**
 * Anonymous client for reading published content on the server.
 * Returns null when Supabase env vars are not configured (e.g. a fresh
 * checkout), letting pages render their empty states instead of crashing.
 */
export function getPublicSupabase(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  if (!cached) {
    cached = createClient<Database>(env.url, env.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export function getPublicStorageUrl(bucket: string, path: string): string | null {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return `${env.url}/storage/v1/object/public/${bucket}/${path}`;
}
