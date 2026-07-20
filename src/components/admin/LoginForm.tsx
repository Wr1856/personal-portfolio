"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { idleActionState, loginAction } from "@/app/(admin)/admin/actions";

export function LoginForm() {
  const t = useTranslations("admin.login");
  const [state, formAction, pending] = useActionState(
    loginAction,
    idleActionState,
  );

  const errorMessage =
    state.status === "error"
      ? state.message === "invalid_credentials"
        ? t("invalidCredentials")
        : state.message === "not_admin"
          ? t("unauthorized")
          : t("genericError")
      : null;

  return (
    <form action={formAction} className="mt-8 w-full space-y-5">
      <div>
        <label htmlFor="admin-email" className="block text-sm text-muted">
          {t("email")}
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 w-full border border-line bg-surface px-4 py-3 text-ivory focus-ring"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="block text-sm text-muted">
          {t("password")}
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full border border-line bg-surface px-4 py-3 text-ivory focus-ring"
        />
      </div>

      <div aria-live="polite">
        {errorMessage ? (
          <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full border border-blue bg-blue px-4 py-3 font-medium text-ivory transition-colors hover:bg-navy disabled:opacity-50 focus-ring"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
