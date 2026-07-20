import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminTable } from "@/components/admin/AdminTable";
import { CertificationForm } from "@/components/admin/CertificationForm";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin");

  const { edit } = await searchParams;
  const t = await getTranslations("admin");
  const supabase = await createSupabaseServerClient();

  if (edit) {
    const certification =
      edit === "new"
        ? null
        : (
            await supabase
              .from("certifications")
              .select("*")
              .eq("id", edit)
              .maybeSingle()
          ).data;

    if (edit !== "new" && !certification) {
      redirect("/admin/certificacoes");
    }

    return (
      <section>
        <h1 className="mb-8 font-display text-3xl text-ivory">
          {t("certifications.title")}
        </h1>
        <CertificationForm certification={certification ?? null} />
      </section>
    );
  }

  const { data: certifications, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("issue_date", { ascending: false });

  if (error) {
    console.error(`[admin] Failed to list certifications: ${error.message}`);
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">
          {t("certifications.title")}
        </h1>
        <Link
          href="/admin/certificacoes?edit=new"
          className="border border-blue bg-blue px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-navy focus-ring"
        >
          {t("table.new")}
        </Link>
      </div>
      <AdminTable
        table="certifications"
        basePath="/admin/certificacoes"
        rows={(certifications ?? []).map((certification) => ({
          id: certification.id,
          title: certification.title,
          subtitle: `${certification.issuer} · ${certification.issue_date}`,
          isPublished: certification.is_published,
          featured: certification.featured,
          aiVisible: certification.ai_visible,
        }))}
      />
    </section>
  );
}
