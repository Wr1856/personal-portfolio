"use client";

import { useConsent } from "@/components/cookies/ConsentProvider";

export function CookiePreferencesButton({ label }: { label: string }) {
  const { openPreferences } = useConsent();

  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-muted hover:text-ivory focus-ring"
    >
      {label}
    </button>
  );
}
