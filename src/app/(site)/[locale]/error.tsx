"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Log only the digest/message; never request payloads or user data.
    console.error(`[error-boundary] ${error.digest ?? error.message}`);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <Monogram size={64} className="text-brass" />
      <h1 className="mt-8 font-display text-4xl text-ivory sm:text-5xl">
        {t("errorTitle")}
      </h1>
      <p className="mt-4 max-w-md text-muted">{t("errorDescription")}</p>
      <Button variant="outline" className="mt-8" onClick={reset}>
        {t("tryAgain")}
      </Button>
    </div>
  );
}
