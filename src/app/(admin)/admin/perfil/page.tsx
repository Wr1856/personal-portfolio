import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAdminUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicStorageUrl } from "@/lib/supabase/public";
import { ProfileFilesForm } from "@/components/admin/ProfileFilesForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin");

  const t = await getTranslations("admin.profile");
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("site_profile")
    .select("resume_path, profile_image_path")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(`[admin] Failed to load profile: ${error.message}`);
  }

  const photoUrl = profile?.profile_image_path
    ? getPublicStorageUrl("branding-public", profile.profile_image_path)
    : null;
  const resumeUrl = profile?.resume_path
    ? getPublicStorageUrl("resumes-public", profile.resume_path)
    : null;

  return (
    <section>
      <h1 className="mb-2 font-display text-3xl text-ivory">{t("title")}</h1>
      <p className="mb-8 max-w-xl text-sm text-muted">{t("description")}</p>
      <ProfileFilesForm photoUrl={photoUrl} resumeUrl={resumeUrl} />
    </section>
  );
}
