"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import {
  contactCategories,
  contactSchema,
  type ContactFormValues,
  type ContactPayload,
} from "@/lib/validation/contact";
import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

type ContactFormProps = {
  locale: "pt" | "en";
  presetCategory: ContactFormValues["category"] | null;
  turnstileSiteKey: string | null;
  whatsappNumber: string;
  publicEmail: string;
  githubUrl: string;
};

type SubmitPhase = "form" | "success";

export function ContactForm({
  locale,
  presetCategory,
  turnstileSiteKey,
  whatsappNumber,
  publicEmail,
  githubUrl,
}: ContactFormProps) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const formId = useId();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [phase, setPhase] = useState<SubmitPhase>("form");
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentValues, setSentValues] = useState<ContactPayload | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues, unknown, ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      category: presetCategory ?? "other",
      message: "",
      preferredContact: "whatsapp",
      consent: false,
      locale,
    },
  });

  // The Wesley Lab selector prefills the category.
  useEffect(() => {
    if (presetCategory) {
      setValue("category", presetCategory);
    }
  }, [presetCategory, setValue]);

  async function onSubmit(values: ContactPayload) {
    setServerError(null);

    if (!turnstileToken) {
      setServerError(t("validation.turnstileRequired"));
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: { ...values, locale },
          turnstileToken,
        }),
      });

      if (response.status === 201) {
        setSentValues(values);
        setPhase("success");
        reset();
        return;
      }

      if (response.status === 429) {
        setServerError(t("validation.rateLimited"));
      } else if (response.status === 403) {
        setServerError(t("validation.turnstileFailed"));
      } else {
        setServerError(t("validation.serverError"));
      }
    } catch {
      setServerError(t("validation.serverError"));
    } finally {
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  }

  const inputClass =
    "mt-1.5 w-full border border-line bg-surface px-4 py-3 text-sm text-ivory placeholder:text-muted/60 focus-ring";
  const errorClass = "mt-1 text-xs text-red-300";

  function fieldError(key: keyof ContactFormValues): string | null {
    const message = errors[key]?.message;
    if (!message) return null;
    return t(`validation.${message}`);
  }

  if (phase === "success" && sentValues) {
    const whatsappUrl = buildWhatsAppUrl(
      whatsappNumber,
      buildContactWhatsAppMessage({
        template: t("whatsappMessage"),
        name: sentValues.name,
        category: t(`categories.${sentValues.category}`),
        message: sentValues.message,
      }),
    );

    return (
      <div
        role="status"
        aria-live="polite"
        className="frame-editorial mx-auto max-w-2xl bg-surface p-6 text-center sm:p-10"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-brass">
          ✓
        </p>
        <h3 className="mt-3 font-display text-3xl text-ivory">
          {t("success.title")}
        </h3>
        <p className="mt-3 text-sm text-muted">{t("success.description")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center border border-blue bg-blue px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-navy focus-ring"
          >
            {t("success.continueWhatsapp")}
            <span className="sr-only"> ({tCommon("externalLink")})</span>
          </a>
          <Button
            variant="outline"
            onClick={() => {
              setPhase("form");
              setSentValues(null);
            }}
          >
            {t("success.newMessage")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h3 className="font-display text-3xl text-ivory sm:text-4xl">
        {t("title")}
      </h3>
      <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5"
      >
        <div>
          <label htmlFor={`${formId}-name`} className="block text-sm text-muted">
            {t("fields.name")} *
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            className={inputClass}
            {...register("name")}
          />
          {fieldError("name") ? (
            <p className={errorClass}>{fieldError("name")}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-email`} className="block text-sm text-muted">
              {t("fields.email")}
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              className={inputClass}
              {...register("email")}
            />
            {fieldError("email") ? (
              <p className={errorClass}>{fieldError("email")}</p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor={`${formId}-whatsapp`}
              className="block text-sm text-muted"
            >
              {t("fields.whatsapp")}
            </label>
            <input
              id={`${formId}-whatsapp`}
              type="tel"
              autoComplete="tel"
              placeholder={t("fields.whatsappHint")}
              aria-invalid={errors.whatsapp ? true : undefined}
              className={inputClass}
              {...register("whatsapp")}
            />
            {fieldError("whatsapp") ? (
              <p className={errorClass}>{fieldError("whatsapp")}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor={`${formId}-category`}
            className="block text-sm text-muted"
          >
            {t("fields.category")} *
          </label>
          <select
            id={`${formId}-category`}
            aria-invalid={errors.category ? true : undefined}
            className={inputClass}
            {...register("category")}
          >
            {contactCategories.map((value) => (
              <option key={value} value={value}>
                {t(`categories.${value}`)}
              </option>
            ))}
          </select>
          {fieldError("category") ? (
            <p className={errorClass}>{fieldError("category")}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-message`} className="block text-sm text-muted">
            {t("fields.message")} *
          </label>
          <textarea
            id={`${formId}-message`}
            rows={5}
            aria-invalid={errors.message ? true : undefined}
            className={inputClass}
            {...register("message")}
          />
          {fieldError("message") ? (
            <p className={errorClass}>{fieldError("message")}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className="text-sm text-muted">
            {t("fields.preferredContact")} *
          </legend>
          <div className="mt-2 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="radio"
                value="whatsapp"
                className="h-4 w-4 accent-[color:var(--blue)] focus-ring"
                {...register("preferredContact")}
              />
              {t("fields.preferredWhatsapp")}
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input
                type="radio"
                value="email"
                className="h-4 w-4 accent-[color:var(--blue)] focus-ring"
                {...register("preferredContact")}
              />
              {t("fields.preferredEmail")}
            </label>
          </div>
          {fieldError("preferredContact") ? (
            <p className={errorClass}>{fieldError("preferredContact")}</p>
          ) : null}
        </fieldset>

        <div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              aria-invalid={errors.consent ? true : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--blue)] focus-ring"
              {...register("consent")}
            />
            {t("fields.consent")}
          </label>
          {fieldError("consent") ? (
            <p className={errorClass}>{fieldError("consent")}</p>
          ) : null}
        </div>

        {turnstileSiteKey ? (
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            options={{ theme: "dark", language: locale }}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        ) : (
          <p className="border border-line px-4 py-3 text-xs text-muted">
            {t("validation.turnstileRequired")}
          </p>
        )}

        <div aria-live="assertive">
          {serverError ? (
            <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {serverError}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting || !turnstileToken} className="w-full sm:w-auto">
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </form>

      <div className="mt-12 border-t border-line pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
          {t("publicChannels")}
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          <li>
            <a
              href={buildWhatsAppUrl(whatsappNumber, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-sm text-ivory hover:border-blue-light hover:text-blue-light focus-ring"
            >
              {t("whatsappLabel")}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${publicEmail}`}
              className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-sm text-ivory hover:border-blue-light hover:text-blue-light focus-ring"
            >
              {t("emailLabel")}
            </a>
          </li>
          <li>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-sm text-ivory hover:border-blue-light hover:text-blue-light focus-ring"
            >
              {t("githubLabel")}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
