import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";

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
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    alternates: {
      canonical: locale === "pt" ? "/pt/privacidade" : "/en/privacy",
      languages: {
        "pt-BR": "/pt/privacidade",
        en: "/en/privacy",
        "x-default": "/pt/privacidade",
      },
    },
  };
}

const content: Record<Locale, Array<{ heading: string; paragraphs: string[] }>> = {
  pt: [
    {
      heading: "Quais dados são coletados",
      paragraphs: [
        "Este site coleta dados pessoais apenas quando você envia o formulário de contato: nome, e-mail e/ou WhatsApp, categoria da necessidade, mensagem e forma de contato preferida. Pelo menos um canal de contato (e-mail ou WhatsApp) é necessário para que a resposta seja possível.",
        "Nenhum dado pessoal é coletado durante a navegação sem o seu consentimento. As métricas de uso (Vercel Analytics) são anônimas e só são carregadas se você aceitar a categoria de analytics no aviso de cookies.",
      ],
    },
    {
      heading: "Para que os dados são usados",
      paragraphs: [
        "Os dados enviados pelo formulário são usados exclusivamente para responder à sua solicitação e dar continuidade à conversa pelo canal que você escolheu. Eles não são vendidos, compartilhados com terceiros para fins comerciais nem usados para envio de comunicações não solicitadas.",
      ],
    },
    {
      heading: "Onde os dados ficam armazenados",
      paragraphs: [
        "As solicitações de contato são armazenadas com controle de acesso no Supabase (PostgreSQL), com políticas de segurança que impedem qualquer leitura pública. Somente o administrador autenticado do site pode acessá-las.",
      ],
    },
    {
      heading: "Por quanto tempo e seus direitos",
      paragraphs: [
        "As solicitações são mantidas apenas pelo tempo necessário para o atendimento e o histórico da conversa. Você pode pedir a atualização ou a exclusão dos seus dados a qualquer momento pelos canais públicos de contato indicados no site.",
        "Este documento descreve as práticas reais deste site de forma transparente e é revisado quando o funcionamento do site muda.",
      ],
    },
  ],
  en: [
    {
      heading: "What data is collected",
      paragraphs: [
        "This site collects personal data only when you submit the contact form: name, email and/or WhatsApp, category of your need, message, and preferred contact method. At least one contact channel (email or WhatsApp) is required so a reply is possible.",
        "No personal data is collected while browsing without your consent. Usage metrics (Vercel Analytics) are anonymous and only load if you accept the analytics category in the cookie notice.",
      ],
    },
    {
      heading: "How the data is used",
      paragraphs: [
        "Data submitted through the form is used exclusively to answer your request and continue the conversation through the channel you chose. It is not sold, shared with third parties for commercial purposes, or used for unsolicited communications.",
      ],
    },
    {
      heading: "Where the data is stored",
      paragraphs: [
        "Contact requests are stored with access control in Supabase (PostgreSQL), protected by security policies that prevent any public read access. Only the authenticated site administrator can access them.",
      ],
    },
    {
      heading: "Retention and your rights",
      paragraphs: [
        "Requests are kept only for as long as needed to handle the conversation and its history. You can ask for your data to be updated or deleted at any time through the public contact channels listed on the site.",
        "This document transparently describes this site's actual practices and is revised whenever the site's behavior changes.",
      ],
    },
  ],
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) notFound();
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legal.privacy" });
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
    </div>
  );
}
