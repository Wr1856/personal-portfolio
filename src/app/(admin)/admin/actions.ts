"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isAuthorizedAdmin, requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  certificationSchema,
  experienceSchema,
  loginSchema,
  projectSchema,
} from "@/lib/validation/admin";
import { buildSafeObjectPath, validateUpload, type UploadKind } from "@/lib/uploads";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errorCode?: "validation" | "unauthorized" | "file_too_large" | "file_invalid_type" | "upload" | "server";
  fieldErrors?: Record<string, string[]>;
};

export const idleActionState: ActionState = { status: "idle" };

function validationError(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return { status: "error", errorCode: "validation", fieldErrors };
}

function revalidatePublicContent() {
  revalidatePath("/", "layout");
}

// --- Auth ---------------------------------------------------------------

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { status: "error", errorCode: "validation" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { status: "error", errorCode: "unauthorized", message: "invalid_credentials" };
  }

  if (!isAuthorizedAdmin(data.user)) {
    // Valid Supabase credentials but not the configured administrator.
    await supabase.auth.signOut();
    return { status: "error", errorCode: "unauthorized", message: "not_admin" };
  }

  redirect("/admin/projetos");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

// --- Upload helper ------------------------------------------------------------

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  file: File,
  bucket: string,
  prefix: string,
  kind: UploadKind,
): Promise<{ path: string } | { error: ActionState }> {
  const invalid = validateUpload(file, kind);
  if (invalid) {
    return {
      error: {
        status: "error",
        errorCode: invalid === "too_large" ? "file_too_large" : "file_invalid_type",
      },
    };
  }

  const path = buildSafeObjectPath(file.name, prefix);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error(`[upload] Failed to store object in ${bucket}: ${error.message}`);
    return { error: { status: "error", errorCode: "upload" } };
  }

  return { path };
}

async function removeFileQuietly(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  bucket: string,
  path: string | null,
) {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`[upload] Failed to remove old object from ${bucket}: ${error.message}`);
  }
}

// --- Projects ------------------------------------------------------------

export async function saveProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", errorCode: "unauthorized" };
  }
  const { supabase } = admin;

  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const id = formData.get("id");
  const existingCoverPath = formData.get("existing_cover_path");
  let coverPath =
    typeof existingCoverPath === "string" && existingCoverPath !== ""
      ? existingCoverPath
      : null;

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    const result = await uploadFile(
      supabase,
      cover,
      "project-covers-public",
      "covers",
      "image",
    );
    if ("error" in result) return result.error;
    await removeFileQuietly(supabase, "project-covers-public", coverPath);
    coverPath = result.path;
  }

  const payload = { ...parsed.data, cover_path: coverPath };

  if (typeof id === "string" && id !== "") {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) {
      console.error(`[admin] Failed to update project: ${error.message}`);
      return { status: "error", errorCode: "server" };
    }
    revalidatePublicContent();
    return { status: "success", message: "updated" };
  }

  const { error } = await supabase.from("projects").insert(payload);
  if (error) {
    console.error(`[admin] Failed to create project: ${error.message}`);
    return { status: "error", errorCode: "server" };
  }
  revalidatePublicContent();
  return { status: "success", message: "created" };
}

// --- Certifications -------------------------------------------------------------

export async function saveCertificationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", errorCode: "unauthorized" };
  }
  const { supabase } = admin;

  const parsed = certificationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const id = formData.get("id");
  const existingFilePath = formData.get("existing_file_path");
  let filePath =
    typeof existingFilePath === "string" && existingFilePath !== ""
      ? existingFilePath
      : null;

  const file = formData.get("private_file");
  if (file instanceof File && file.size > 0) {
    const result = await uploadFile(
      supabase,
      file,
      "certificates-private",
      "certificates",
      "certificate",
    );
    if ("error" in result) return result.error;
    await removeFileQuietly(supabase, "certificates-private", filePath);
    filePath = result.path;
  }

  const payload = { ...parsed.data, private_file_path: filePath };

  if (typeof id === "string" && id !== "") {
    const { error } = await supabase
      .from("certifications")
      .update(payload)
      .eq("id", id);
    if (error) {
      console.error(`[admin] Failed to update certification: ${error.message}`);
      return { status: "error", errorCode: "server" };
    }
    revalidatePublicContent();
    return { status: "success", message: "updated" };
  }

  const { error } = await supabase.from("certifications").insert(payload);
  if (error) {
    console.error(`[admin] Failed to create certification: ${error.message}`);
    return { status: "error", errorCode: "server" };
  }
  revalidatePublicContent();
  return { status: "success", message: "created" };
}

// --- Experiences -------------------------------------------------------------

export async function saveExperienceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", errorCode: "unauthorized" };
  }
  const { supabase } = admin;

  const parsed = experienceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const id = formData.get("id");

  if (typeof id === "string" && id !== "") {
    const { error } = await supabase
      .from("experiences")
      .update(parsed.data)
      .eq("id", id);
    if (error) {
      console.error(`[admin] Failed to update experience: ${error.message}`);
      return { status: "error", errorCode: "server" };
    }
    revalidatePublicContent();
    return { status: "success", message: "updated" };
  }

  const { error } = await supabase.from("experiences").insert(parsed.data);
  if (error) {
    console.error(`[admin] Failed to create experience: ${error.message}`);
    return { status: "error", errorCode: "server" };
  }
  revalidatePublicContent();
  return { status: "success", message: "created" };
}

// --- Shared row operations -----------------------------------------------------

type ManagedTable = "projects" | "certifications" | "experiences";

const tableSchema = z.enum(["projects", "certifications", "experiences"]);
const uuidSchema = z.uuid();

export async function deleteRowAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const table = tableSchema.parse(formData.get("table")) as ManagedTable;
  const id = uuidSchema.parse(formData.get("id"));

  // Remove associated stored files first.
  if (table === "projects") {
    const { data } = await supabase
      .from("projects")
      .select("cover_path")
      .eq("id", id)
      .maybeSingle();
    await removeFileQuietly(supabase, "project-covers-public", data?.cover_path ?? null);
  }
  if (table === "certifications") {
    const { data } = await supabase
      .from("certifications")
      .select("private_file_path")
      .eq("id", id)
      .maybeSingle();
    await removeFileQuietly(
      supabase,
      "certificates-private",
      data?.private_file_path ?? null,
    );
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    console.error(`[admin] Failed to delete from ${table}: ${error.message}`);
    throw new Error("DELETE_FAILED");
  }
  revalidatePublicContent();
}

const flagSchema = z.enum(["is_published", "featured", "ai_visible"]);

export async function toggleFlagAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const table = tableSchema.parse(formData.get("table")) as ManagedTable;
  const id = uuidSchema.parse(formData.get("id"));
  const flag = flagSchema.parse(formData.get("flag"));
  const nextValue = formData.get("value") === "true";

  if (table === "experiences" && flag === "featured") {
    // Experiences have no featured flag.
    return;
  }

  // Explicit object per flag so the typed client accepts the partial update.
  const update =
    flag === "is_published"
      ? { is_published: nextValue }
      : flag === "featured"
        ? { featured: nextValue }
        : { ai_visible: nextValue };

  // Narrow per table so the typed client accepts the partial update.
  const result =
    table === "projects"
      ? await supabase.from("projects").update(update).eq("id", id)
      : table === "certifications"
        ? await supabase.from("certifications").update(update).eq("id", id)
        : await supabase
            .from("experiences")
            .update(
              flag === "is_published"
                ? { is_published: nextValue }
                : { ai_visible: nextValue },
            )
            .eq("id", id);

  const { error } = result;
  if (error) {
    console.error(`[admin] Failed to toggle ${flag} on ${table}: ${error.message}`);
    throw new Error("TOGGLE_FAILED");
  }
  revalidatePublicContent();
}

export async function reorderRowAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const table = tableSchema.parse(formData.get("table")) as ManagedTable;
  const id = uuidSchema.parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));

  const { data: rows, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !rows) {
    console.error(`[admin] Failed to load rows for reorder: ${error?.message}`);
    throw new Error("REORDER_FAILED");
  }

  const index = rows.findIndex((row) => row.id === id);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || neighborIndex < 0 || neighborIndex >= rows.length) {
    return;
  }

  const current = rows[index];
  const neighbor = rows[neighborIndex];

  // Ensure distinct sort orders even when rows share the default value.
  const currentOrder =
    current.sort_order === neighbor.sort_order
      ? neighbor.sort_order + (direction === "up" ? -1 : 1)
      : neighbor.sort_order;

  const updates = [
    supabase.from(table).update({ sort_order: currentOrder }).eq("id", current.id),
    supabase
      .from(table)
      .update({ sort_order: current.sort_order })
      .eq("id", neighbor.id),
  ];
  const results = await Promise.all(updates);
  for (const result of results) {
    if (result.error) {
      console.error(`[admin] Failed to reorder ${table}: ${result.error.message}`);
      throw new Error("REORDER_FAILED");
    }
  }
  revalidatePublicContent();
}

// --- Profile files (photo + résumé) ---------------------------------------------

export async function saveProfileFilesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return { status: "error", errorCode: "unauthorized" };
  }
  const { supabase } = admin;

  const { data: profile, error: profileError } = await supabase
    .from("site_profile")
    .select("id, resume_path, profile_image_path")
    .limit(1)
    .maybeSingle();

  if (profileError || !profile) {
    console.error(`[admin] Failed to load profile: ${profileError?.message}`);
    return { status: "error", errorCode: "server" };
  }

  const updates: { resume_path?: string; profile_image_path?: string } = {};

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    const result = await uploadFile(supabase, photo, "branding-public", "profile", "image");
    if ("error" in result) return result.error;
    await removeFileQuietly(supabase, "branding-public", profile.profile_image_path);
    updates.profile_image_path = result.path;
  }

  const resume = formData.get("resume");
  if (resume instanceof File && resume.size > 0) {
    const result = await uploadFile(supabase, resume, "resumes-public", "resume", "resume");
    if ("error" in result) return result.error;
    await removeFileQuietly(supabase, "resumes-public", profile.resume_path);
    updates.resume_path = result.path;
  }

  if (Object.keys(updates).length === 0) {
    return { status: "error", errorCode: "validation" };
  }

  const { error } = await supabase
    .from("site_profile")
    .update(updates)
    .eq("id", profile.id);
  if (error) {
    console.error(`[admin] Failed to update profile files: ${error.message}`);
    return { status: "error", errorCode: "server" };
  }

  revalidatePublicContent();
  return { status: "success", message: "updated" };
}
