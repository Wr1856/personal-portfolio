import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAdminUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Monogram } from "@/components/ui/Monogram";

export default async function AdminLoginPage() {
  const user = await getAdminUser();
  if (user) {
    redirect("/admin/projetos");
  }

  const t = await getTranslations("admin.login");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center pt-12">
      <Monogram size={64} className="text-brass" />
      <h1 className="mt-6 font-display text-3xl text-ivory">{t("title")}</h1>
      <p className="mt-2 text-center text-sm text-muted">{t("subtitle")}</p>
      <LoginForm />
    </div>
  );
}
