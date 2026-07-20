"use client";

import { useLocale, useTranslations } from "next-intl";

import type { LocalizedCertification } from "@/lib/localize";
import { Tag } from "@/components/ui/Tag";

function formatDate(value: string, locale: string): string {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    year: "numeric",
    month: "short",
  }).format(date);
}

export function CertificationsList({
  certifications,
}: {
  certifications: LocalizedCertification[];
}) {
  const t = useTranslations("archive.certifications");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (certifications.length === 0) {
    return (
      <p className="border border-line bg-surface px-4 py-12 text-center text-muted">
        {t("empty")}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {certifications.map((certification, index) => (
        <li key={certification.id}>
          <article className="frame-editorial h-full bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                {String(index + 1).padStart(2, "0")}
              </p>
              <Tag tone="brass">{certification.category}</Tag>
            </div>
            <h3 className="mt-3 font-display text-2xl leading-snug text-ivory">
              {certification.title}
            </h3>
            <p className="mt-1 text-sm text-blue-light">{certification.issuer}</p>

            <dl className="mt-4 space-y-1 text-sm text-muted">
              <div className="flex gap-2">
                <dt className="font-mono text-[11px] uppercase tracking-wider">
                  {t("issued")}:
                </dt>
                <dd>{formatDate(certification.issueDate, locale)}</dd>
              </div>
              {certification.expirationDate ? (
                <div className="flex gap-2">
                  <dt className="font-mono text-[11px] uppercase tracking-wider">
                    {t("expires")}:
                  </dt>
                  <dd>{formatDate(certification.expirationDate, locale)}</dd>
                </div>
              ) : null}
              {certification.credentialCode ? (
                <div className="flex gap-2">
                  <dt className="font-mono text-[11px] uppercase tracking-wider">
                    {t("credentialCode")}:
                  </dt>
                  <dd className="break-all font-mono text-xs">
                    {certification.credentialCode}
                  </dd>
                </div>
              ) : null}
            </dl>

            {certification.credentialUrl ? (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center border border-line px-4 py-2 text-sm text-ivory transition-colors hover:border-blue-light hover:text-blue-light focus-ring"
              >
                {t("verify")}
                <span className="sr-only"> ({tCommon("externalLink")})</span>
                <span aria-hidden="true" className="ml-2">
                  ↗
                </span>
              </a>
            ) : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
