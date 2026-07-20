import { z } from "zod";

const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const requiredText = z.string().trim().min(1).max(5000);
const optionalText = z
  .string()
  .trim()
  .max(5000)
  .transform((value) => (value === "" ? null : value));

const optionalHttpsUrl = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .refine(
    (value) => {
      if (value === null) return true;
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "URL must be a valid https:// address" },
  );

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const optionalIsoDate = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .refine((value) => value === null || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Invalid date",
  });

const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

/** Comma-separated list -> trimmed, de-duplicated string array. */
const csvList = z
  .string()
  .trim()
  .max(1000)
  .transform((value) =>
    Array.from(
      new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ),
  );

export const projectSchema = z.object({
  slug: slugSchema,
  title_pt: requiredText.pipe(z.string().max(160)),
  title_en: requiredText.pipe(z.string().max(160)),
  summary_pt: requiredText,
  summary_en: requiredText,
  problem_pt: requiredText,
  problem_en: requiredText,
  solution_pt: requiredText,
  solution_en: requiredText,
  result_pt: optionalText,
  result_en: optionalText,
  category: requiredText.pipe(z.string().max(60)),
  project_type: z.enum([
    "professional",
    "brand",
    "academic",
    "conceptual",
    "in_development",
  ]),
  status: z.enum(["completed", "in_progress", "maintained", "archived"]),
  technologies: csvList,
  video_url: optionalHttpsUrl,
  demo_url: optionalHttpsUrl,
  repository_url: optionalHttpsUrl,
  original_url: optionalHttpsUrl,
  featured: checkbox,
  is_published: checkbox,
  ai_visible: checkbox,
});

export const certificationSchema = z.object({
  title: requiredText.pipe(z.string().max(200)),
  issuer: requiredText.pipe(z.string().max(160)),
  category: requiredText.pipe(z.string().max(60)),
  issue_date: isoDate,
  expiration_date: optionalIsoDate,
  credential_code: optionalText.pipe(z.string().max(160).nullable()),
  credential_url: optionalHttpsUrl,
  featured: checkbox,
  is_published: checkbox,
  ai_visible: checkbox,
});

export const experienceSchema = z
  .object({
    company: requiredText.pipe(z.string().max(160)),
    role_pt: requiredText.pipe(z.string().max(160)),
    role_en: requiredText.pipe(z.string().max(160)),
    description_pt: requiredText,
    description_en: requiredText,
    start_date: isoDate,
    end_date: optionalIsoDate,
    is_current: checkbox,
    skills: csvList,
    is_published: checkbox,
    ai_visible: checkbox,
  })
  .transform((value) => ({
    ...value,
    // A current position has no end date.
    end_date: value.is_current ? null : value.end_date,
  }));

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(1).max(200),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
