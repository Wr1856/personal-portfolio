import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { SECTION_IDS, TECHNOLOGIES } from "@/lib/constants";
import type { LocalizedProfile } from "@/lib/localize";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

const pillarKeys = ["build", "communicate", "sustain"] as const;

type ProfileSectionProps = {
  locale: Locale;
  profile: LocalizedProfile | null;
};

export async function ProfileSection({ locale, profile }: ProfileSectionProps) {
  const t = await getTranslations({ locale, namespace: "profile" });

  return (
    <section
      id={SECTION_IDS.profile}
      aria-labelledby="perfil-titulo"
      className="scroll-mt-24 bg-background-secondary py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            id="perfil-titulo"
            number={t("sectionNumber")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </Reveal>

        <Reveal>
          <p className="max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {profile?.bio ?? t("bio")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillarKeys.map((key, index) => (
            <Reveal key={key} delay={index * 0.1}>
              <article className="frame-editorial h-full bg-surface p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-3xl text-ivory">
                  {t(`pillars.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {t(`pillars.${key}.description`)}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {(t.raw(`pillars.${key}.items`) as string[]).map((item) => (
                    <li key={item}>
                      <Tag>{item}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <h3 className="font-display text-2xl text-ivory">
              {t("technologiesTitle")}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {TECHNOLOGIES.map((technology) => (
                <li key={technology}>
                  <Tag tone="blue">{technology}</Tag>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-12 max-w-2xl border-t border-line pt-6 text-sm text-muted">
            {t("availability")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
