import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const entries: Array<{ pt: string; en: string; priority: number }> = [
    { pt: "/pt", en: "/en", priority: 1 },
    { pt: "/pt/privacidade", en: "/en/privacy", priority: 0.3 },
    { pt: "/pt/cookies", en: "/en/cookies", priority: 0.3 },
  ];

  return entries.flatMap(({ pt, en, priority }) =>
    [pt, en].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          "pt-BR": `${siteUrl}${pt}`,
          en: `${siteUrl}${en}`,
        },
      },
    })),
  );
}
