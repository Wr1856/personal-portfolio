import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { requireSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Cookie-based client for authenticated admin requests in Server
 * Components, Server Actions, and Route Handlers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requireSupabasePublicEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component: session refresh cookies are
          // handled by the proxy instead, so this can be safely ignored.
        }
      },
    },
  });
}
