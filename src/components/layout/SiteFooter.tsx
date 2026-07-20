import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { BRAND } from "@/lib/constants";
import { Monogram } from "@/components/ui/Monogram";
import { CookiePreferencesButton } from "@/components/cookies/CookiePreferencesButton";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tProfile = useTranslations("profile");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-background-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 text-brass">
            <Monogram size={48} title="Wesley Maia" />
            <div>
              <p className="font-display text-lg text-ivory">Wesley Maia</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                EST. {year}
              </p>
            </div>
          </div>

          <nav aria-label={t("privacy")} className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/privacidade"
              className="text-sm text-muted hover:text-ivory focus-ring"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted hover:text-ivory focus-ring"
            >
              {t("cookies")}
            </Link>
            <CookiePreferencesButton label={t("cookiePreferences")} />
            <a
              href={BRAND.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-ivory focus-ring"
            >
              GitHub
            </a>
          </nav>
        </div>

        <blockquote className="mt-10 border-l border-brass/40 pl-4">
          <p className="font-display text-base italic text-muted">
            “{tProfile("quote")}”
          </p>
          <cite className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-brass not-italic">
            — {tProfile("quoteAuthor")}
          </cite>
        </blockquote>

        <p className="mt-10 text-xs text-muted">
          © {year} Wesley Maia. {t("rights")} {t("builtBy")}
        </p>
      </div>
    </footer>
  );
}
