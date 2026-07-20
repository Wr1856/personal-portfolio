import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServiceRoleKey, getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Service-role client. Server-only: importing this module from client code
 * fails at build time thanks to the "server-only" package. Used exclusively
 * by validated endpoints (e.g. storing contact requests).
 */
export function getServiceSupabase(): SupabaseClient<Database> | null {
  const env = getSupabasePublicEnv();
  const serviceKey = getServiceRoleKey();
  if (!env || !serviceKey) return null;
  return createClient<Database>(env.url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
