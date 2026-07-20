import { z } from "zod";

export const contactCategories = [
  "build_site",
  "fix_problem",
  "promote_business",
  "improve_identity",
  "meet_wesley",
  "other",
] as const;

export type ContactCategoryValue = (typeof contactCategories)[number];

const whatsappRegex = /^\+?[\d\s().-]{8,20}$/;

/**
 * Shared between the client form and the server endpoint. Error messages are
 * message keys resolved through next-intl on both sides.
 */
export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "nameRequired")
      .max(120, "nameTooLong"),
    email: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((value) => {
        const trimmed = (value ?? "").trim();
        return trimmed === "" ? null : trimmed;
      })
      .refine(
        (value) =>
          value === null ||
          (value.length <= 254 && z.email().safeParse(value).success),
        { message: "emailInvalid" },
      ),
    whatsapp: z
      .union([z.string(), z.null(), z.undefined()])
      .transform((value) => {
        const trimmed = (value ?? "").trim();
        return trimmed === "" ? null : trimmed;
      })
      .refine(
        (value) =>
          value === null || (value.length <= 20 && whatsappRegex.test(value)),
        { message: "whatsappInvalid" },
      ),
    category: z.enum(contactCategories, { message: "categoryRequired" }),
    message: z
      .string()
      .trim()
      .min(10, "messageRequired")
      .max(2000, "messageTooLong"),
    preferredContact: z.enum(["email", "whatsapp"], {
      message: "preferredRequired",
    }),
    consent: z.boolean().refine((value) => value === true, {
      message: "consentRequired",
    }),
    locale: z.enum(["pt", "en"]).catch("pt"),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.whatsapp) {
      ctx.addIssue({
        code: "custom",
        message: "emailOrWhatsapp",
        path: ["email"],
      });
    }
    if (data.preferredContact === "email" && !data.email) {
      ctx.addIssue({
        code: "custom",
        message: "emailInvalid",
        path: ["email"],
      });
    }
    if (data.preferredContact === "whatsapp" && !data.whatsapp) {
      ctx.addIssue({
        code: "custom",
        message: "whatsappInvalid",
        path: ["whatsapp"],
      });
    }
  });

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactPayload = z.output<typeof contactSchema>;

export const contactRequestSchema = z.object({
  form: contactSchema,
  turnstileToken: z.string().min(1, "turnstileRequired").max(4096),
});
