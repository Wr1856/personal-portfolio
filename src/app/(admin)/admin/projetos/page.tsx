import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/public";
import { AdminTable } from "@/components/admin/AdminTable";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({
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
    const project =
      edit === "new"
        ? null
        : (
            await supabase
              .from("projects")
              .select("*")
              .eq("id", edit)
              .maybeSingle()
          ).data;

    if (edit !== "new" && !project) {
      redirect("/admin/projetos");
    }

    const coverUrl = project?.cover_path
      ? getPublicStorageUrl("project-covers-public", project.cover_path)
      : null;

    return (
      <section>
        <h1 className="mb-8 font-display text-3xl text-ivory">
          {t("projects.title")}
        </h1>
        <ProjectForm project={project ?? null} coverUrl={coverUrl} />
      </section>
    );
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`[admin] Failed to list projects: ${error.message}`);
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">{t("projects.title")}</h1>
        <Link
          href="/admin/projetos?edit=new"
          className="border border-blue bg-blue px-4 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-navy focus-ring"
        >
          {t("table.new")}
        </Link>
      </div>
      <AdminTable
        table="projects"
        basePath="/admin/projetos"
        rows={(projects ?? []).map((project) => ({
          id: project.id,
          title: project.title_pt,
          subtitle: `${project.category} · ${project.slug}`,
          isPublished: project.is_published,
          featured: project.featured,
          aiVisible: project.ai_visible,
        }))}
      />
    </section>
  );
}
