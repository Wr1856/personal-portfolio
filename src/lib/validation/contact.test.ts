import { describe, expect, it } from "vitest";

import { contactRequestSchema, contactSchema } from "@/lib/validation/contact";

const validForm = {
  name: "Maria Silva",
  email: "maria@example.com",
  whatsapp: "",
  category: "build_site",
  message: "Preciso de um site institucional para minha empresa.",
  preferredContact: "email",
  consent: true,
  locale: "pt",
};

describe("contactSchema", () => {
  it("accepts a valid submission with e-mail only", () => {
    const result = contactSchema.safeParse(validForm);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("maria@example.com");
      expect(result.data.whatsapp).toBeNull();
    }
  });

  it("accepts a valid submission with WhatsApp only", () => {
    const result = contactSchema.safeParse({
      ...validForm,
      email: "",
      whatsapp: "+55 71 91234-5678",
      preferredContact: "whatsapp",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when both e-mail and WhatsApp are missing", () => {
    const result = contactSchema.safeParse({
      ...validForm,
      email: "",
      whatsapp: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "emailOrWhatsapp",
      );
    }
  });

  it("rejects an invalid e-mail", () => {
    const result = contactSchema.safeParse({ ...validForm, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("requires the preferred channel to be filled", () => {
    const result = contactSchema.safeParse({
      ...validForm,
      email: "",
      whatsapp: "+55 71 91234-5678",
      preferredContact: "email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is not given", () => {
    const result = contactSchema.safeParse({ ...validForm, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "consentRequired",
      );
    }
  });

  it("rejects messages that are too short", () => {
    const result = contactSchema.safeParse({ ...validForm, message: "oi" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown categories", () => {
    const result = contactSchema.safeParse({ ...validForm, category: "spam" });
    expect(result.success).toBe(false);
  });

  it("falls back to Portuguese for unknown locales", () => {
    const result = contactSchema.safeParse({ ...validForm, locale: "fr" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.locale).toBe("pt");
    }
  });
});

describe("contactRequestSchema", () => {
  it("requires a Turnstile token", () => {
    const result = contactRequestSchema.safeParse({
      form: validForm,
      turnstileToken: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a full request", () => {
    const result = contactRequestSchema.safeParse({
      form: validForm,
      turnstileToken: "token-123",
    });
    expect(result.success).toBe(true);
  });
});
