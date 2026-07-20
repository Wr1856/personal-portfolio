import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getAdminEmail, getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Refreshes the Supabase session cookie and performs an optimistic
 * redirect for unauthenticated /admin requests. The authoritative check
 * (including the ADMIN_EMAIL match) also happens in the admin layout.
 */
export async function updateAdminSession(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin";
  const adminEmail = getAdminEmail();
  const isAuthorized =
    user !== null &&
    adminEmail !== null &&
    user.email?.toLowerCase() === adminEmail.toLowerCase();

  if (!isAuthorized && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthorized && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/projetos";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
