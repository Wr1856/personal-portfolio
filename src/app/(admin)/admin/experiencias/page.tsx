import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminTable } from "@/components/admin/AdminTable";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage({
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
    const experience =
      edit === "new"
        ? null
        : (
            await supabase
              .from("experiences")
              .select("*")
              .eq("id", edit)
              .maybeSingle()
          ).data;

    if (edit !== "new" && !experience) {
      redirect("/admin/experiencias");
    }

    return (
      <section>
        <h1 className="mb-8 font-display text-3xl text-ivory">
          {t("experiences.title")}
        </h1>
        <ExperienceForm experience={experience ?? null} />
      </section>
    );
  }

  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    console.error(`[admin] Failed to list experiences: ${error.message}`);
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">
          {t("experiences.title")}
        </h1>
        <Link
          href="/admin/experiencias?edit=new"
          className="border border-blue bg-blue px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-navy focus-ring"
        >
          {t("table.new")}
        </Link>
      </div>
      <AdminTable
        table="experiences"
        basePath="/admin/experiencias"
        rows={(experiences ?? []).map((experience) => ({
          id: experience.id,
          title: `${experience.role_pt} — ${experience.company}`,
          subtitle: `${experience.start_date}${
            experience.end_date ? ` → ${experience.end_date}` : ""
          }${experience.is_current ? " · atual" : ""}`,
          isPublished: experience.is_published,
          featured: null,
          aiVisible: experience.ai_visible,
        }))}
      />
    </section>
  );
}
