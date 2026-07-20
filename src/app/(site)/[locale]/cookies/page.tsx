import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { CookiePreferencesButton } from "@/components/cookies/CookiePreferencesButton";

export const revalidate = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("cookiesTitle"),
    description: t("cookiesDescription"),
    alternates: {
      canonical: `/${locale}/cookies`,
      languages: {
        "pt-BR": "/pt/cookies",
        en: "/en/cookies",
        "x-default": "/pt/cookies",
      },
    },
  };
}

const content: Record<Locale, Array<{ heading: string; paragraphs: string[] }>> = {
  pt: [
    {
      heading: "Cookies necessários",
      paragraphs: [
        "São essenciais para o funcionamento do site e não podem ser desativados: a preferência de idioma (NEXT_LOCALE), a sessão de autenticação do painel administrativo (usada somente pelo administrador) e o registro da sua escolha de consentimento.",
      ],
    },
    {
      heading: "Analytics (opcional)",
      paragraphs: [
        "Com o seu consentimento, o site carrega o Vercel Analytics, que coleta métricas anônimas de navegação (páginas visitadas e desempenho). Nenhum identificador pessoal é usado. Se você recusar, nada é carregado.",
      ],
    },
    {
      heading: "Como alterar sua escolha",
      paragraphs: [
        "Você pode revisar sua preferência a qualquer momento pelo botão abaixo ou pelo link \u201cPreferências de cookies\u201d no rodapé.",
      ],
    },
  ],
  en: [
    {
      heading: "Necessary cookies",
      paragraphs: [
        "These are essential for the site to work and cannot be disabled: the language preference (NEXT_LOCALE), the admin panel authentication session (used only by the administrator), and the record of your consent choice.",
      ],
    },
    {
      heading: "Analytics (optional)",
      paragraphs: [
        "With your consent, the site loads Vercel Analytics, which collects anonymous navigation metrics (pages visited and performance). No personal identifiers are used. If you decline, nothing is loaded.",
      ],
    },
    {
      heading: "How to change your choice",
      paragraphs: [
        "You can review your preference at any time using the button below or the \u201cCookie preferences\u201d link in the footer.",
      ],
    },
  ],
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legal.cookiesPage" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const updatedAt = new Intl.DateTimeFormat(
    locale === "pt" ? "pt-BR" : "en-US",
    { dateStyle: "long" },
  ).format(new Date("2026-07-14"));

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
        {t("updated", { date: updatedAt })}
      </p>

      {content[locale].map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-2xl text-ivory">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mt-4 text-sm leading-relaxed text-muted"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <div className="mt-10 border border-line bg-surface p-5">
        <CookiePreferencesButton label={tFooter("cookiePreferences")} />
      </div>
    </div>
  );
}
