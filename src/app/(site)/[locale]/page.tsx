import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { BRAND } from "@/lib/constants";
import {
  getPublishedCertifications,
  getPublishedExperiences,
  getPublishedProjects,
  getPublishedServices,
  getSiteProfile,
} from "@/lib/data/public";
import {
  localizeCertification,
  localizeExperience,
  localizeProfile,
  localizeProject,
  localizeService,
} from "@/lib/localize";
import { getPublicStorageUrl } from "@/lib/supabase/public";
import { Hero } from "@/components/sections/Hero";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ArchiveSection } from "@/components/sections/archive/ArchiveSection";
import { WesleyLabSection } from "@/components/sections/lab/WesleyLabSection";
import { PersonJsonLd } from "@/components/seo/JsonLd";

// Public content is served through incremental static regeneration; admin
// mutations also revalidate explicitly.
export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(routing.locales, rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  setRequestLocale(locale);

  const [profileRow, projectRows, certificationRows, experienceRows, serviceRows] =
    await Promise.all([
      getSiteProfile(),
      getPublishedProjects(),
      getPublishedCertifications(),
      getPublishedExperiences(),
      getPublishedServices(),
    ]);

  const profile = profileRow ? localizeProfile(profileRow, locale) : null;
  const projects = projectRows.map((row) => localizeProject(row, locale));
  const certifications = certificationRows.map(localizeCertification);
  const experiences = experienceRows.map((row) => localizeExperience(row, locale));
  const services = serviceRows.map((row) => localizeService(row, locale));

  const coverUrls: Record<string, string> = {};
  for (const project of projects) {
    if (project.coverPath) {
      const url = getPublicStorageUrl("project-covers-public", project.coverPath);
      if (url) coverUrls[project.id] = url;
    }
  }

  return (
    <>
      <PersonJsonLd locale={locale} profile={profile} projects={projects} />
      <Hero locale={locale} profile={profile} />
      <ProfileSection locale={locale} profile={profile} />
      <ArchiveSection
        projects={projects}
        certifications={certifications}
        experiences={experiences}
        coverUrls={coverUrls}
      />
      <WesleyLabSection
        services={services}
        locale={locale}
        turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null}
        whatsappNumber={profile?.whatsapp ?? BRAND.whatsappNumber}
        publicEmail={profile?.email ?? BRAND.email}
        githubUrl={profile?.githubUrl ?? BRAND.githubUrl}
      />
    </>
  );
}
