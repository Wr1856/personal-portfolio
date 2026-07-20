"use client";

import { useActionState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  idleActionState,
  saveProfileFilesAction,
  type ActionState,
} from "@/app/(admin)/admin/actions";
import { FileField, FormFeedback } from "@/components/admin/form-fields";

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

export function ProfileFilesForm({
  photoUrl,
  resumeUrl,
}: {
  photoUrl: string | null;
  resumeUrl: string | null;
}) {
  const t = useTranslations("admin.profile");
  const tForm = useTranslations("admin.form");
  const [state, formAction, pending] = useActionState(
    saveProfileFilesAction,
    idleActionState,
  );

  return (
    <form action={formAction} className="space-y-8">
      <FormFeedback
        status={state.status}
        successMessage={tForm("updated")}
        errorMessage={errorMessageFor(state, tForm)}
      />

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {t("title")}
        </legend>

        <div>
          <p className="mb-2 text-sm text-muted">{t("currentPhoto")}</p>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt=""
              width={160}
              height={200}
              className="border border-line object-cover"
            />
          ) : (
            <p className="text-sm text-muted">{t("noPhoto")}</p>
          )}
        </div>
        <FileField
          label={t("photo")}
          name="photo"
          accept="image/jpeg,image/png,image/webp,image/avif"
        />

        <div>
          <p className="mb-2 text-sm text-muted">{t("currentResume")}</p>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-light underline focus-ring"
            >
              {tForm("preview")}
            </a>
          ) : (
            <p className="text-sm text-muted">{t("noResume")}</p>
          )}
        </div>
        <FileField label={t("resume")} name="resume" accept="application/pdf" />
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="border border-blue bg-blue px-6 py-3 font-medium text-ivory transition-colors hover:bg-navy disabled:opacity-50 focus-ring"
      >
        {pending ? tForm("saving") : tForm("save")}
      </button>
    </form>
  );
}
