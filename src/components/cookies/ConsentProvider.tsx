"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useTranslations } from "next-intl";
import { Analytics } from "@vercel/analytics/react";

import {
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeConsent,
  writeConsent,
} from "@/lib/consent";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type ConsentContextValue = {
  openPreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }
  return context;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("cookies");
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const [hydrated, setHydrated] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const bannerTitleId = useId();
  const prefsTitleId = useId();

  // useSyncExternalStore returns the server snapshot (null) during
  // hydration; flag readiness on the first client render via ref callback.
  const markHydrated = useCallback((node: HTMLElement | null) => {
    if (node) setHydrated(true);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    writeConsent(analytics);
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setAnalyticsChoice(getConsentSnapshot()?.analytics ?? false);
    setPreferencesOpen(true);
  }, []);

  const value = useMemo(() => ({ openPreferences }), [openPreferences]);

  const showBanner = hydrated && consent === null && !preferencesOpen;

  return (
    <ConsentContext.Provider value={value}>
      {children}

      <span ref={markHydrated} hidden aria-hidden="true" />

      {consent?.analytics ? <Analytics /> : null}

      {showBanner ? (
        <div
          role="region"
          aria-labelledby={bannerTitleId}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-elevated/98 p-4 shadow-2xl backdrop-blur-sm sm:p-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 id={bannerTitleId} className="font-display text-lg text-ivory">
                {t("banner.title")}
              </h2>
              <p className="mt-1 text-sm text-muted">{t("banner.description")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={openPreferences}>
                {t("banner.customize")}
              </Button>
              <Button variant="outline" onClick={() => decide(false)}>
                {t("banner.rejectAnalytics")}
              </Button>
              <Button onClick={() => decide(true)}>{t("banner.acceptAll")}</Button>
            </div>
          </div>
        </div>
      ) : null}

      <Modal
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        labelledBy={prefsTitleId}
      >
        <h2 id={prefsTitleId} className="font-display text-2xl text-ivory">
          {t("preferences.title")}
        </h2>

        <div className="mt-6 space-y-5">
          <div className="border border-line p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-ivory">{t("preferences.necessary")}</p>
              <span className="font-mono text-[11px] uppercase tracking-widest text-brass">
                ON
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">
              {t("preferences.necessaryDescription")}
            </p>
          </div>

          <div className="border border-line p-4">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="analytics-toggle" className="font-medium text-ivory">
                {t("preferences.analytics")}
              </label>
              <input
                id="analytics-toggle"
                type="checkbox"
                checked={analyticsChoice}
                onChange={(event) => setAnalyticsChoice(event.target.checked)}
                className="h-5 w-5 accent-[color:var(--blue)] focus-ring"
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              {t("preferences.analyticsDescription")}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => decide(analyticsChoice)}>
            {t("preferences.save")}
          </Button>
        </div>
      </Modal>
    </ConsentContext.Provider>
  );
}
