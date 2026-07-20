import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  let locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Non-localized routes (e.g. /admin) have no locale segment; honor the
  // persisted preference cookie there, falling back to Portuguese.
  if (!requested) {
    const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
    if (hasLocale(routing.locales, cookieLocale)) {
      locale = cookieLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
