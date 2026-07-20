"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { SECTION_IDS } from "@/lib/constants";
import { Monogram } from "@/components/ui/Monogram";
import { buttonClasses } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const sectionLinks = [
  { key: "home", hash: SECTION_IDS.home },
  { key: "profile", hash: SECTION_IDS.profile },
  { key: "archive", hash: SECTION_IDS.archive },
  { key: "lab", hash: SECTION_IDS.lab },
] as const;

type SiteHeaderProps = {
  resumeAvailable: boolean;
};

export function SiteHeader({ resumeAvailable }: SiteHeaderProps) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-line bg-background/95 backdrop-blur-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20">
        <Link
          href="/"
          className="flex items-center gap-3 text-ivory focus-ring"
          onClick={closeMenu}
        >
          <Monogram size={40} className="text-brass" />
          <span className="hidden font-display text-lg tracking-wide sm:inline">
            Wesley Maia
          </span>
        </Link>

        <nav
          aria-label={t("mainNavigation")}
          className="hidden items-center gap-6 lg:flex"
        >
          {sectionLinks.map(({ key, hash }) => (
            <a
              key={key}
              href={`#${hash}`}
              className="text-sm text-muted transition-colors hover:text-ivory focus-ring"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {resumeAvailable ? (
            <a
              href="/api/resume"
              className={buttonClasses("outline", "md")}
              download
            >
              {t("resume")}
            </a>
          ) : null}
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center border border-line text-ivory focus-ring"
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-200 ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-full bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-full bg-current transition-transform duration-200 ${
                  menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id={menuId}
          aria-label={t("mainNavigation")}
          className="border-t border-line bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {sectionLinks.map(({ key, hash }) => (
              <li key={key}>
                <a
                  href={`#${hash}`}
                  onClick={closeMenu}
                  className="block border-b border-line py-4 font-display text-2xl text-ivory focus-ring"
                >
                  {t(key)}
                </a>
              </li>
            ))}
            {resumeAvailable ? (
              <li className="pt-4">
                <a
                  href="/api/resume"
                  download
                  onClick={closeMenu}
                  className={buttonClasses("outline", "md", "w-full")}
                >
                  {t("resume")}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
