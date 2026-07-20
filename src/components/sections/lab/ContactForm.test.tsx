import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";
import { ContactForm } from "@/components/sections/lab/ContactForm";

function renderForm() {
  return renderWithIntl(
    <ContactForm
      locale="pt"
      presetCategory={null}
      turnstileSiteKey={null}
      whatsappNumber="5571991797751"
      publicEmail="contato@example.com"
      githubUrl="https://github.com/Wr1856"
    />,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("shows validation errors when submitting empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(await screen.findByText("Informe seu nome.")).toBeInTheDocument();
    expect(
      screen.getByText("Informe pelo menos um e-mail ou um WhatsApp."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Descreva sua necessidade em pelo menos 10 caracteres."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("É necessário autorizar o armazenamento para enviar."),
    ).toBeInTheDocument();
  });

  it("requires the Turnstile check before sending", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText("Nome *"), "Maria Silva");
    await user.type(
      screen.getByRole("textbox", { name: "E-mail" }),
      "maria@example.com",
    );
    await user.type(
      screen.getByLabelText("Descreva sua necessidade *"),
      "Preciso de um site institucional completo.",
    );
    await user.click(screen.getByLabelText(/Autorizo o armazenamento/));
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(
      await screen.findByText("Confirme a verificação de segurança."),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("prefills the category from the Wesley Lab selection", () => {
    renderWithIntl(
      <ContactForm
        locale="pt"
        presetCategory="promote_business"
        turnstileSiteKey={null}
        whatsappNumber="5571991797751"
        publicEmail="contato@example.com"
        githubUrl="https://github.com/Wr1856"
      />,
    );

    expect(
      screen.getByLabelText("Categoria da necessidade *"),
    ).toHaveValue("promote_business");
  });

  it("lists the public channels with safe external links", () => {
    renderForm();
    const github = screen.getByRole("link", { name: "GitHub" });
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
    expect(github).toHaveAttribute("target", "_blank");
  });
});
