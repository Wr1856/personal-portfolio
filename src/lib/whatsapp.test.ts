import { describe, expect, it } from "vitest";

import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("strips formatting from the number", () => {
    expect(buildWhatsAppUrl("+55 71 99179-7751", "")).toBe(
      "https://wa.me/5571991797751",
    );
  });

  it("encodes the message", () => {
    const url = buildWhatsAppUrl("5571991797751", "Olá, tudo bem?");
    expect(url).toBe(
      "https://wa.me/5571991797751?text=Ol%C3%A1%2C%20tudo%20bem%3F",
    );
  });
});

describe("buildContactWhatsAppMessage", () => {
  const template = "Olá, Wesley. Meu nome é {name}. Categoria: {category}. {message}";

  it("fills the template", () => {
    const message = buildContactWhatsAppMessage({
      template,
      name: "Maria",
      category: "Site ou sistema",
      message: "Quero um site.",
    });
    expect(message).toBe(
      "Olá, Wesley. Meu nome é Maria. Categoria: Site ou sistema. Quero um site.",
    );
  });

  it("truncates long messages", () => {
    const message = buildContactWhatsAppMessage({
      template,
      name: "Maria",
      category: "Outro assunto",
      message: "a".repeat(600),
      maxMessageLength: 100,
    });
    expect(message.endsWith("…")).toBe(true);
    expect(message.length).toBeLessThan(200);
  });
});
