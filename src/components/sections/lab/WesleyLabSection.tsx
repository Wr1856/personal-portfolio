"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/constants";
import type { LocalizedService } from "@/lib/localize";
import type { ContactCategoryValue } from "@/lib/validation/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { ContactForm } from "@/components/sections/lab/ContactForm";

const needs: ContactCategoryValue[] = [
  "build_site",
  "fix_problem",
  "promote_business",
  "improve_identity",
  "meet_wesley",
  "other",
];

type WesleyLabSectionProps = {
  services: LocalizedService[];
  locale: "pt" | "en";
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  publicEmail: string;
  githubUrl: string;
};

export function WesleyLabSection({
  services,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  publicEmail,
  githubUrl,
}: WesleyLabSectionProps) {
  const t = useTranslations("lab");
  const [selectedNeed, setSelectedNeed] = useState<ContactCategoryValue | null>(
    null,
  );

  const relatedServices = useMemo(() => {
    if (!selectedNeed || selectedNeed === "meet_wesley" || selectedNeed === "other") {
      return [];
    }
    return services.filter((service) => service.category === selectedNeed);
  }, [services, selectedNeed]);

  const highlightIds = new Set(relatedServices.map((service) => service.id));
  const showMeetWesleyHint = selectedNeed === "meet_wesley";

  return (
    <section
      id={SECTION_IDS.lab}
      aria-labelledby="lab-titulo"
      className="scroll-mt-24 bg-background-secondary py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="lab-titulo"
          number={t("sectionNumber")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <p className="max-w-2xl text-base text-muted">{t("intro")}</p>

        <fieldset className="mt-8 border-0 p-0">
          <legend className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-brass">
            {t("needsLegend")}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((need) => (
              <button
                key={need}
                type="button"
                aria-pressed={selectedNeed === need}
                onClick={() =>
                  setSelectedNeed((current) => (current === need ? null : need))
                }
                className={`min-h-14 border px-4 py-3 text-left text-sm transition-colors focus-ring ${
                  selectedNeed === need
                    ? "border-blue-light bg-navy text-ivory"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-ivory"
                }`}
              >
                {t(`needs.${need}`)}
              </button>
            ))}
          </div>
        </fieldset>

        {showMeetWesleyHint ? (
          <div
            aria-live="polite"
            className="mt-8 border border-brass/40 bg-surface p-5"
          >
            <p className="text-sm text-muted">{t("meetWesleyHint")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`#${SECTION_IDS.profile}`}
                className="border border-line px-4 py-2.5 text-sm text-ivory hover:border-blue-light hover:text-blue-light focus-ring"
              >
                {t("goToProfile")}
              </a>
              <a
                href={`#${SECTION_IDS.archive}`}
                className="border border-line px-4 py-2.5 text-sm text-ivory hover:border-blue-light hover:text-blue-light focus-ring"
              >
                {t("goToArchive")}
              </a>
            </div>
          </div>
        ) : null}

        <h3 className="mt-14 font-display text-3xl text-ivory">
          {relatedServices.length > 0 ? t("relatedServices") : t("servicesTitle")}
        </h3>

        {services.length === 0 ? (
          <p className="mt-6 border border-line bg-surface px-4 py-12 text-center text-muted">
            {t("empty")}
          </p>
        ) : (
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {services.map((service) => {
              const highlighted = highlightIds.has(service.id);
              const dimmed = highlightIds.size > 0 && !highlighted;
              return (
                <li key={service.id}>
                  <article
                    className={`frame-editorial h-full p-5 transition-opacity sm:p-6 ${
                      highlighted
                        ? "border-blue-light/70 bg-navy/30"
                        : "bg-surface"
                    } ${dimmed ? "opacity-50" : ""}`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {service.featured ? (
                        <Tag tone="brass">{t("featured")}</Tag>
                      ) : null}
                      {service.remoteAvailable ? <Tag>{t("remote")}</Tag> : null}
                      {service.onsiteAvailable ? <Tag>{t("onsite")}</Tag> : null}
                    </div>
                    <h4 className="mt-3 font-display text-2xl text-ivory">
                      {service.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {service.description}
                    </p>
                    <p className="mt-3 text-sm text-muted">{service.scope}</p>
                    <p className="mt-4 font-mono text-xs uppercase tracking-wider text-blue-light">
                      {service.startingPrice !== null
                        ? t("startingPrice", {
                            price: new Intl.NumberFormat(
                              locale === "pt" ? "pt-BR" : "en-US",
                              { style: "currency", currency: "BRL" },
                            ).format(service.startingPrice),
                          })
                        : t("priceOnRequest")}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <div id={SECTION_IDS.contact} className="scroll-mt-24 pt-16">
          <ContactForm
            locale={locale}
            presetCategory={selectedNeed}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            publicEmail={publicEmail}
            githubUrl={githubUrl}
          />
        </div>
      </div>
    </section>
  );
}
