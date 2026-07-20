import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";

export default function NotFoundPage() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <Monogram size={64} className="text-brass" />
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.35em] text-muted">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mt-4 max-w-md text-muted">{t("notFoundDescription")}</p>
      <Link href="/" className={buttonClasses("outline", "md", "mt-8")}>
        {t("goHome")}
      </Link>
    </div>
  );
}
