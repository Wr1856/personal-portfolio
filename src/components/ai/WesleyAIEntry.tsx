"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

import { SECTION_IDS, isWesleyAiEnabled } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";
import { Monogram } from "@/components/ui/Monogram";

const shortcuts = [
  { key: "goToArchive", hash: SECTION_IDS.archive },
  { key: "goToLab", hash: SECTION_IDS.lab },
  { key: "goToContact", hash: SECTION_IDS.contact },
] as const;

/**
 * Global entry point for the future AI assistant. In this version it only
 * announces the upcoming feature and offers navigation shortcuts — it never
 * pretends to be a working chatbot. The NEXT_PUBLIC_WESLEY_AI_ENABLED flag
 * is reserved for v2; while false, the "coming soon" panel is shown.
 */
export function WesleyAIEntry() {
  const t = useTranslations("wesleyAi");
  const [open, setOpen] = useState(false);
  const titleId = useId();

  // v2 will replace the informational panel with the real assistant.
  if (isWesleyAiEnabled()) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openPanel")}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 border border-brass/50 bg-surface-elevated px-4 py-3 text-ivory shadow-lg transition-colors hover:border-brass focus-ring"
      >
        <Monogram size={22} className="text-brass" />
        <span className="text-sm font-medium">{t("title")}</span>
        <span className="border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
          {t("badge")}
        </span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className="flex items-center gap-3">
          <Monogram size={40} className="text-brass" />
          <div>
            <h2 id={titleId} className="font-display text-2xl text-ivory">
              {t("title")}
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-widest text-brass">
              {t("badge")}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          {t("description")}
        </p>
        <p className="mt-4 text-sm text-ivory">{t("notYet")}</p>

        <ul className="mt-4 space-y-2">
          {shortcuts.map(({ key, hash }) => (
            <li key={key}>
              <a
                href={`#${hash}`}
                onClick={() => setOpen(false)}
                className="block border border-line px-4 py-3 text-sm text-ivory transition-colors hover:border-blue-light hover:text-blue-light focus-ring"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
