import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import "@/app/globals.css";

import { routing, type Locale } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/constants";
import { getSiteProfile } from "@/lib/data/public";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConsentProvider } from "@/components/cookies/ConsentProvider";
import { WesleyAIEntry } from "@/components/ai/WesleyAIEntry";
import { PwaProvider } from "@/components/pwa/PwaProvider";

export const viewport: Viewport = {
  themeColor: "#05070B",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: "%s — Wesley Maia",
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt",
        en: "/en",
        "x-default": "/pt",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Wesley Maia",
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "common" });
  const profile = await getSiteProfile();

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} className={fontVariables}>
      <body className="texture-grain min-h-screen bg-background font-sans text-ivory antialiased">
        <NextIntlClientProvider>
          <ConsentProvider>
            <a
              href="#conteudo"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-navy focus:px-4 focus:py-3 focus:text-ivory"
            >
              {t("skipToContent")}
            </a>
            <SiteHeader resumeAvailable={Boolean(profile?.resume_path)} />
            <main id="conteudo" className="relative z-0">
              {children}
            </main>
            <SiteFooter />
            <WesleyAIEntry />
            <PwaProvider />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
