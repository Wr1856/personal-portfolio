import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateAdminSession } from "@/lib/supabase/proxy-session";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return updateAdminSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|manifest\\.webmanifest|sw\\.js|icons|images|favicon\\.ico|.*\\..*).*)",
    "/admin/:path*",
  ],
};
