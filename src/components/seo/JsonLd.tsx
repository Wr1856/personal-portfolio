import type { Locale } from "@/i18n/routing";
import { BRAND, getSiteUrl } from "@/lib/constants";
import type { LocalizedProfile, LocalizedProject } from "@/lib/localize";

type PersonJsonLdProps = {
  locale: Locale;
  profile: LocalizedProfile | null;
  projects: LocalizedProject[];
};

/**
 * JSON-LD structured data: Person, ProfessionalService (remote-first, no
 * physical business address claimed), and CreativeWork per published project.
 */
export function PersonJsonLd({ locale, profile, projects }: PersonJsonLdProps) {
  const siteUrl = getSiteUrl();
  const name = profile?.name ?? BRAND.name;
  const title =
    profile?.professionalTitle ??
    (locale === "pt"
      ? "Desenvolvedor e Especialista em Soluções Digitais"
      : "Developer and Digital Solutions Specialist");

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name,
    jobTitle: title,
    url: `${siteUrl}/${locale}`,
    sameAs: [profile?.githubUrl ?? BRAND.githubUrl],
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: `${name} — ${title}`,
    url: `${siteUrl}/${locale}`,
    founder: { "@id": `${siteUrl}/#person` },
    areaServed:
      locale === "pt"
        ? "Atendimento remoto nacional e internacional"
        : "Remote services, national and international",
  };

  const creativeWorks = projects.map((project) => ({
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/${locale}?project=${project.slug}`,
    author: { "@id": `${siteUrl}/#person` },
    keywords: project.technologies.join(", "),
  }));

  const data = {
    "@context": "https://schema.org",
    "@graph": [person, professionalService, ...creativeWorks],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
