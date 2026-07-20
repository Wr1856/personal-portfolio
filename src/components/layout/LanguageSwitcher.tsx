"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type AppPathname, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
};

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: Locale) {
    if (next === locale) return;
    router.replace(
      // Pathname and params always correspond to a valid localized route here.
      { pathname: pathname as AppPathname, params } as Parameters<
        typeof router.replace
      >[0],
      { locale: next },
    );
  }

  return (
    <div
      role="group"
      aria-label={t("languageSwitcher")}
      className="flex items-center border border-line"
    >
      {locales.map((code, index) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-pressed={code === locale}
          aria-label={code === "pt" ? t("portuguese") : t("english")}
          className={`px-3 py-2 font-mono text-xs tracking-widest transition-colors focus-ring min-h-11 ${
            code === locale
              ? "bg-navy text-ivory"
              : "text-muted hover:text-ivory"
          } ${index > 0 ? "border-l border-line" : ""}`}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
