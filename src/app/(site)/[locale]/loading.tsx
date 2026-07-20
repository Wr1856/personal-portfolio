import { useTranslations } from "next-intl";

import { Monogram } from "@/components/ui/Monogram";

export default function LocaleLoading() {
  const t = useTranslations("common");

  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24"
      role="status"
      aria-live="polite"
    >
      <Monogram size={56} className="animate-pulse text-brass" />
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">
        {t("loading")}
      </p>
    </div>
  );
}
