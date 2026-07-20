"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  idleActionState,
  saveExperienceAction,
} from "@/app/(admin)/admin/actions";
import type { ExperienceRow } from "@/types/database";
import {
  CheckboxField,
  FormFeedback,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";

export function ExperienceForm({
  experience,
}: {
  experience: ExperienceRow | null;
}) {
  const t = useTranslations("admin.experiences");
  const tForm = useTranslations("admin.form");
  const tTable = useTranslations("admin.table");
  const [state, formAction, pending] = useActionState(
    saveExperienceAction,
    idleActionState,
  );

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {experience ? <input type="hidden" name="id" value={experience.id} /> : null}

      <FormFeedback
        status={state.status}
        successMessage={
          state.message === "created" ? tForm("created") : tForm("updated")
        }
        errorMessage={tForm("error")}
      />

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("settingsSection")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("fields.company")}
            name="company"
            required
            defaultValue={experience?.company}
            errors={fe.company}
          />
          <TextField
            label={t("fields.skills")}
            name="skills"
            defaultValue={experience?.skills.join(", ")}
            errors={fe.skills}
          />
          <TextField
            label={t("fields.startDate")}
            name="start_date"
            type="date"
            required
            defaultValue={experience?.start_date ?? ""}
            errors={fe.start_date}
          />
          <TextField
            label={t("fields.endDate")}
            name="end_date"
            type="date"
            defaultValue={experience?.end_date ?? ""}
            errors={fe.end_date}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label={t("fields.isCurrent")}
            name="is_current"
            defaultChecked={experience?.is_current ?? false}
          />
          <CheckboxField
            label={tTable("published")}
            name="is_published"
            defaultChecked={experience?.is_published ?? false}
          />
          <CheckboxField
            label={tTable("aiVisible")}
            name="ai_visible"
            defaultChecked={experience?.ai_visible ?? true}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("portugueseSection")}
        </legend>
        <TextField
          label={t("fields.rolePt")}
          name="role_pt"
          required
          defaultValue={experience?.role_pt}
          errors={fe.role_pt}
        />
        <TextAreaField
          label={t("fields.descriptionPt")}
          name="description_pt"
          required
          defaultValue={experience?.description_pt}
          errors={fe.description_pt}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("englishSection")}
        </legend>
        <TextField
          label={t("fields.roleEn")}
          name="role_en"
          required
          defaultValue={experience?.role_en}
          errors={fe.role_en}
        />
        <TextAreaField
          label={t("fields.descriptionEn")}
          name="description_en"
          required
          defaultValue={experience?.description_en}
          errors={fe.description_en}
        />
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
          href="/admin/experiencias"
          className="border border-line px-6 py-3 text-muted hover:text-ivory focus-ring"
        >
          {tForm("cancel")}
        </Link>
      </div>
    </form>
  );
}
