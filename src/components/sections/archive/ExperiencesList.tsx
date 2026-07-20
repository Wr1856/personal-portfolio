"use client";

import { useTranslations } from "next-intl";

import type { LocalizedExperience } from "@/lib/localize";
import { Tag } from "@/components/ui/Tag";

function formatYear(value: string): string {
  return value.slice(0, 4);
}

export function ExperiencesList({
  experiences,
}: {
  experiences: LocalizedExperience[];
}) {
  const t = useTranslations("archive.experiences");

  if (experiences.length === 0) {
    return (
      <p className="border border-line bg-surface px-4 py-12 text-center text-muted">
        {t("empty")}
      </p>
    );
  }

  return (
    <ol className="relative space-y-8 border-l border-line pl-6 sm:pl-10">
      {experiences.map((experience) => {
        const start = formatYear(experience.startDate);
        const end = experience.isCurrent
          ? t("present")
          : experience.endDate
            ? formatYear(experience.endDate)
            : t("present");
        const period =
          start === end ? start : t("period", { start, end });

        return (
          <li key={experience.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[29px] top-2 h-2.5 w-2.5 rotate-45 border border-brass bg-background sm:-left-[45px]"
            />
            <article className="frame-editorial bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-brass">
                  {period}
                </p>
                {experience.isCurrent ? (
                  <Tag tone="blue">{t("current")}</Tag>
                ) : null}
              </div>
              <h3 className="mt-2 font-display text-2xl text-ivory">
                {experience.role}
              </h3>
              <p className="text-sm text-blue-light">{experience.company}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {experience.description}
              </p>
              {experience.skills.length > 0 ? (
                <ul
                  aria-label={t("skills")}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {experience.skills.map((skill) => (
                    <li key={skill}>
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
