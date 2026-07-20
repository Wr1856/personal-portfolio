"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  idleActionState,
  saveCertificationAction,
  type ActionState,
} from "@/app/(admin)/admin/actions";
import type { CertificationRow } from "@/types/database";
import {
  CheckboxField,
  FileField,
  FormFeedback,
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

export function CertificationForm({
  certification,
}: {
  certification: CertificationRow | null;
}) {
  const t = useTranslations("admin.certifications");
  const tForm = useTranslations("admin.form");
  const tTable = useTranslations("admin.table");
  const [state, formAction, pending] = useActionState(
    saveCertificationAction,
    idleActionState,
  );

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8">
      {certification ? (
        <input type="hidden" name="id" value={certification.id} />
      ) : null}
      {certification?.private_file_path ? (
        <input
          type="hidden"
          name="existing_file_path"
          value={certification.private_file_path}
        />
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
          {t("title")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={t("fields.title")}
            name="title"
            required
            defaultValue={certification?.title}
            errors={fe.title}
          />
          <TextField
            label={t("fields.issuer")}
            name="issuer"
            required
            defaultValue={certification?.issuer}
            errors={fe.issuer}
          />
          <TextField
            label={t("fields.category")}
            name="category"
            required
            defaultValue={certification?.category}
            errors={fe.category}
          />
          <TextField
            label={t("fields.issueDate")}
            name="issue_date"
            type="date"
            required
            defaultValue={certification?.issue_date ?? ""}
            errors={fe.issue_date}
          />
          <TextField
            label={t("fields.expirationDate")}
            name="expiration_date"
            type="date"
            defaultValue={certification?.expiration_date ?? ""}
            errors={fe.expiration_date}
          />
          <TextField
            label={t("fields.credentialCode")}
            name="credential_code"
            defaultValue={certification?.credential_code ?? ""}
            errors={fe.credential_code}
          />
          <TextField
            label={t("fields.credentialUrl")}
            name="credential_url"
            type="url"
            defaultValue={certification?.credential_url ?? ""}
            errors={fe.credential_url}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label={tTable("featured")}
            name="featured"
            defaultChecked={certification?.featured ?? false}
          />
          <CheckboxField
            label={tTable("published")}
            name="is_published"
            defaultChecked={certification?.is_published ?? false}
          />
          <CheckboxField
            label={tTable("aiVisible")}
            name="ai_visible"
            defaultChecked={certification?.ai_visible ?? true}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-line p-4 sm:p-6">
        <legend className="px-2 font-mono text-xs uppercase tracking-widest text-brass">
          {tForm("filesSection")}
        </legend>
        {certification?.private_file_path ? (
          <p className="text-sm text-muted">
            {tForm("currentFile")}:{" "}
            <a
              href={`/api/admin/certificate-file/${certification.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-light underline focus-ring"
            >
              {tForm("preview")}
            </a>
          </p>
        ) : null}
        <FileField
          label={t("fields.privateFile")}
          name="private_file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/avif"
          errors={fe.private_file}
          hint={t("privateNote")}
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
          href="/admin/certificacoes"
          className="border border-line px-6 py-3 text-muted hover:text-ivory focus-ring"
        >
          {tForm("cancel")}
        </Link>
      </div>
    </form>
  );
}
