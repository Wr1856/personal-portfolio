import "server-only";

import type { User } from "@supabase/supabase-js";

import { getAdminEmail } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isAuthorizedAdmin(user: User | null): boolean {
  const adminEmail = getAdminEmail();
  return (
    user !== null &&
    adminEmail !== null &&
    user.email?.toLowerCase() === adminEmail.toLowerCase()
  );
}

/**
 * Loads the current user and asserts they are the authorized administrator.
 * Every server action and admin page goes through this check — the proxy
 * redirect is only an optimistic first barrier.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAuthorizedAdmin(user)) {
    throw new Error("UNAUTHORIZED");
  }

  return { supabase, user: user as User };
}

export async function getAdminUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return isAuthorizedAdmin(user) ? user : null;
  } catch {
    // Supabase not configured (e.g. fresh checkout): treat as signed out.
    return null;
  }
}
