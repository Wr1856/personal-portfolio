import { defineRouting } from "next-intl/routing";

export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
  pathnames: {
    "/": "/",
    "/privacidade": {
      pt: "/privacidade",
      en: "/privacy",
    },
    "/cookies": "/cookies",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
