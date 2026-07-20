import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { SECTION_IDS } from "@/lib/constants";
import type { LocalizedProfile } from "@/lib/localize";
import { getPublicStorageUrl } from "@/lib/supabase/public";
import { buttonClasses } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";

type HeroProps = {
  locale: Locale;
  profile: LocalizedProfile | null;
};

export async function Hero({ locale, profile }: HeroProps) {
  const t = await getTranslations({ locale, namespace: "hero" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const portraitUrl = profile?.profileImagePath
    ? getPublicStorageUrl("branding-public", profile.profileImagePath)
    : null;

  const name = profile?.name ?? tCommon("brandName");
  const title = profile?.professionalTitle ?? tCommon("professionalTitle");

  return (
    <section
      id={SECTION_IDS.home}
      aria-label={name}
      className="relative flex min-h-svh items-center overflow-hidden pt-20"
    >
      {/* Faint archival grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px)",
          backgroundSize: "clamp(160px, 25vw, 320px) 100%",
          opacity: 0.25,
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
              <Monogram size={28} />
              {t("kicker")}
            </p>

            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-ivory xs:text-6xl sm:text-7xl lg:text-8xl">
              {name.toUpperCase()}
            </h1>

            <p className="mt-4 text-lg text-blue-light sm:text-xl">{title}</p>

            <p className="mt-6 max-w-xl border-l border-brass/40 pl-4 font-display text-xl italic leading-relaxed text-muted sm:text-2xl">
              “{tCommon("tagline")}”
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`#${SECTION_IDS.archive}`}
                className={buttonClasses("primary", "lg")}
              >
                {t("exploreArchive")}
              </a>
              <a
                href={`#${SECTION_IDS.contact}`}
                className={buttonClasses("outline", "lg")}
              >
                {t("talkToWesley")}
              </a>
              {profile?.resumePath ? (
                <a
                  href="/api/resume"
                  download
                  className={buttonClasses("ghost", "lg")}
                >
                  {t("downloadResume")} ↓
                </a>
              ) : null}
            </div>

            <p className="mt-10 inline-flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-blue-light"
              />
              {tCommon("remoteBadge")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="order-first lg:order-none">
          <figure className="relative mx-auto w-56 xs:w-64 sm:w-72 lg:w-full lg:max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-3 border border-brass/30 [border-radius:50%_50%_50%_50%/60%_60%_40%_40%] lg:-inset-4"
            />
            <div className="frame-editorial relative aspect-[4/5] overflow-hidden bg-surface [border-radius:50%_50%_50%_50%/60%_60%_40%_40%]">
              {portraitUrl ? (
                <Image
                  src={portraitUrl}
                  alt={t("portraitAlt")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 288px, 384px"
                  className="object-cover object-top"
                />
              ) : (
                <div
                  role="img"
                  aria-label={t("portraitAlt")}
                  className="flex h-full w-full items-center justify-center text-brass"
                >
                  <Monogram size={96} />
                </div>
              )}
            </div>
            <figcaption className="sr-only">{t("portraitAlt")}</figcaption>
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-2 text-brass sm:-right-4"
              title={t("sealLabel")}
            >
              <Monogram size={56} />
            </div>
          </figure>
        </Reveal>
      </div>

      <a
        href={`#${SECTION_IDS.profile}`}
        aria-label={t("scrollHint")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-ivory focus-ring sm:flex"
      >
        {t("scrollHint")}
        <span aria-hidden="true" className="block h-8 w-px bg-line-strong" />
      </a>
    </section>
  );
}
