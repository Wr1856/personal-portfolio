"use client";

import { useId } from "react";

type BaseProps = {
  label: string;
  name: string;
  errors?: string[];
  required?: boolean;
};

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-300">
      {errors.join(" ")}
    </p>
  );
}

const inputClass =
  "mt-1.5 w-full border border-line bg-surface px-3 py-2.5 text-sm text-ivory focus-ring";

export function TextField({
  label,
  name,
  errors,
  required,
  type = "text",
  defaultValue,
  placeholder,
  hint,
}: BaseProps & {
  type?: "text" | "url" | "date" | "email";
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? errorId : undefined}
        className={inputClass}
      />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <FieldErrors id={errorId} errors={errors} />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  errors,
  required,
  defaultValue,
  rows = 4,
}: BaseProps & { defaultValue?: string; rows?: number }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={rows}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? errorId : undefined}
        className={inputClass}
      />
      <FieldErrors id={errorId} errors={errors} />
    </div>
  );
}

export function SelectField({
  label,
  name,
  errors,
  required,
  defaultValue,
  options,
}: BaseProps & {
  defaultValue?: string;
  options: Array<{ value: string; label: string }>;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? errorId : undefined}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrors id={errorId} errors={errors} />
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-ivory">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[color:var(--blue)] focus-ring"
      />
      {label}
    </label>
  );
}

export function FileField({
  label,
  name,
  errors,
  accept,
  hint,
}: BaseProps & { accept: string; hint?: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-muted">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? errorId : undefined}
        className="mt-1.5 w-full border border-line bg-surface px-3 py-2.5 text-sm text-muted file:mr-3 file:border file:border-line file:bg-surface-elevated file:px-3 file:py-1.5 file:text-ivory focus-ring"
      />
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <FieldErrors id={errorId} errors={errors} />
    </div>
  );
}

export function FormFeedback({
  status,
  successMessage,
  errorMessage,
}: {
  status: "idle" | "success" | "error";
  successMessage: string;
  errorMessage: string;
}) {
  return (
    <div aria-live="polite">
      {status === "success" ? (
        <p className="border border-blue/60 bg-navy/40 px-4 py-3 text-sm text-blue-light">
          {successMessage}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
