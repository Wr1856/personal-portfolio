"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  idleActionState,
  saveProjectAction,
  type ActionState,
} from "@/app/(admin)/admin/actions";
import type { ProjectRow } from "@/types/database";
import {
  CheckboxField,
  FileField,
  FormFeedback,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";

function errorMessageFor(state: ActionState, t: (key: string) => string) {
  switch (state.errorCode) {
    case "file_too_large":
      return t("fileTooLarge");
    case "file_invalid_type":
      return t("fileInvalidType");
    case "upload":
      return t("uploadError");
    default:
      return t("error");
  }
}

export function ProjectForm({
  project,
  coverUrl,
}: {
  project: ProjectRow | null;
  coverUrl: string | null;
}) {
  const t = useTranslations("admin.projects.fields");
  const tForm = useTranslations("admin.form");
  const tTypes = useTranslations("archive.projects.types");
  const tStatuses = useTranslations("archive.projects.statuses");
  const tTable = useTranslations("admin.table");
  const [state, formAction, pending] = useActionState(
    saveProjectAction,
    idleActionState,
  );

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      {project?.cover_path ? (
        <input type="hidden" name="existing_cover_path" value={project.cover_path} />
      ) : null}

      <FormFeedback
        status={state.status}
        successMessage={
          state.message === "created" ? tForm("created") : tForm("updated")
        }
        errorMessage={errorMessageFor(state, tForm)}
      />

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("settingsSection")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("slug")}
            name="slug"
            required
            defaultValue={project?.slug}
            errors={fe.slug}
            hint={tForm("invalidSlug")}
          />
          <TextField
            label={t("category")}
            name="category"
            required
            defaultValue={project?.category}
            errors={fe.category}
          />
          <SelectField
            label={t("projectType")}
            name="project_type"
            required
            defaultValue={project?.project_type ?? "professional"}
            errors={fe.project_type}
            options={[
              { value: "professional", label: tTypes("professional") },
              { value: "brand", label: tTypes("brand") },
              { value: "academic", label: tTypes("academic") },
              { value: "conceptual", label: tTypes("conceptual") },
              { value: "in_development", label: tTypes("in_development") },
            ]}
          />
          <SelectField
            label={t("status")}
            name="status"
            required
            defaultValue={project?.status ?? "completed"}
            errors={fe.status}
            options={[
              { value: "completed", label: tStatuses("completed") },
              { value: "in_progress", label: tStatuses("in_progress") },
              { value: "maintained", label: tStatuses("maintained") },
              { value: "archived", label: tStatuses("archived") },
            ]}
          />
        </div>
        <TextField
          label={t("technologies")}
          name="technologies"
          defaultValue={project?.technologies.join(", ")}
          errors={fe.technologies}
        />
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label={tTable("featured")}
            name="featured"
            defaultChecked={project?.featured ?? false}
          />
          <CheckboxField
            label={tTable("published")}
            name="is_published"
            defaultChecked={project?.is_published ?? false}
          />
          <CheckboxField
            label={tTable("aiVisible")}
            name="ai_visible"
            defaultChecked={project?.ai_visible ?? true}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("portugueseSection")}
        </legend>
        <TextField
          label={t("titlePt")}
          name="title_pt"
          required
          defaultValue={project?.title_pt}
          errors={fe.title_pt}
        />
        <TextAreaField
          label={t("summaryPt")}
          name="summary_pt"
          required
          rows={2}
          defaultValue={project?.summary_pt}
          errors={fe.summary_pt}
        />
        <TextAreaField
          label={t("problemPt")}
          name="problem_pt"
          required
          defaultValue={project?.problem_pt}
          errors={fe.problem_pt}
        />
        <TextAreaField
          label={t("solutionPt")}
          name="solution_pt"
          required
          defaultValue={project?.solution_pt}
          errors={fe.solution_pt}
        />
        <TextAreaField
          label={t("resultPt")}
          name="result_pt"
          rows={2}
          defaultValue={project?.result_pt ?? ""}
          errors={fe.result_pt}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("englishSection")}
        </legend>
        <TextField
          label={t("titleEn")}
          name="title_en"
          required
          defaultValue={project?.title_en}
          errors={fe.title_en}
        />
        <TextAreaField
          label={t("summaryEn")}
          name="summary_en"
          required
          rows={2}
          defaultValue={project?.summary_en}
          errors={fe.summary_en}
        />
        <TextAreaField
          label={t("problemEn")}
          name="problem_en"
          required
          defaultValue={project?.problem_en}
          errors={fe.problem_en}
        />
        <TextAreaField
          label={t("solutionEn")}
          name="solution_en"
          required
          defaultValue={project?.solution_en}
          errors={fe.solution_en}
        />
        <TextAreaField
          label={t("resultEn")}
          name="result_en"
          rows={2}
          defaultValue={project?.result_en ?? ""}
          errors={fe.result_en}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("filesSection")}
        </legend>
        {coverUrl ? (
          <figure>
            <figcaption className="mb-2 text-sm text-muted">
              {tForm("currentFile")}
            </figcaption>
            <Image
              src={coverUrl}
              alt=""
              width={320}
              height={180}
              className="border border-line object-cover"
            />
          </figure>
        ) : null}
        <FileField
          label={t("cover")}
          name="cover"
          accept="image/jpeg,image/png,image/webp,image/avif"
          errors={fe.cover}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("videoUrl")}
            name="video_url"
            type="url"
            defaultValue={project?.video_url ?? ""}
            errors={fe.video_url}
          />
          <TextField
            label={t("demoUrl")}
            name="demo_url"
            type="url"
            defaultValue={project?.demo_url ?? ""}
            errors={fe.demo_url}
          />
          <TextField
            label={t("repositoryUrl")}
            name="repository_url"
            type="url"
            defaultValue={project?.repository_url ?? ""}
            errors={fe.repository_url}
          />
          <TextField
            label={t("originalUrl")}
            name="original_url"
            type="url"
            defaultValue={project?.original_url ?? ""}
            errors={fe.original_url}
          />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="border border-blue bg-blue px-6 py-3 font-medium text-ivory transition-colors hover:bg-navy disabled:opacity-50 focus-ring"
        >
          {pending ? tForm("saving") : tForm("save")}
        </button>
        <Link
          href="/admin/projetos"
          className="border border-line px-6 py-3 text-muted hover:text-ivory focus-ring"
        >
          {tForm("cancel")}
        </Link>
      </div>
    </form>
  );
}
