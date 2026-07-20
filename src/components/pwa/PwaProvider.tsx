"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    emit();
  });
}

/**
 * Registers the service worker and renders an install button when the
 * browser exposes the install prompt. The site works normally without it.
 */
export function PwaProvider() {
  const t = useTranslations("pwa");

  const canInstall = useSyncExternalStore(
    subscribe,
    () => deferredPrompt !== null,
    () => false,
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error(`[pwa] Service worker registration failed: ${error}`);
      });
    }
  }, []);

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        const prompt = deferredPrompt;
        if (!prompt) return;
        await prompt.prompt();
        await prompt.userChoice;
        deferredPrompt = null;
        emit();
      }}
      className="fixed bottom-5 left-5 z-40 border border-line bg-surface-elevated px-4 py-3 text-sm text-ivory shadow-lg transition-colors hover:border-blue-light focus-ring"
    >
      {t("install")} ↓
    </button>
  );
}
