"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
