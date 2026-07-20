import { expect, test } from "@playwright/test";

test.describe("Public pages", () => {
  test("opens in Portuguese at /pt", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(
      page.getByRole("heading", { level: 1, name: /wesley maia/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explorar o acervo" }),
    ).toBeVisible();
  });

  test("opens in English at /en", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("link", { name: "Explore the archive" }),
    ).toBeVisible();
  });

  test.describe("with a Portuguese browser", () => {
    test.use({ locale: "pt-BR" });

    test("redirects the root path to the default locale", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/pt$/);
    });
  });

  test("switches language through the header control", async ({
    page,
    isMobile,
  }) => {
    test.skip(Boolean(isMobile), "Language switcher variant tested on desktop");
    await page.goto("/pt");
    await page
      .getByRole("group", { name: "Selecionar idioma" })
      .first()
      .getByRole("button", { name: "Inglês" })
      .click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("opens and closes a project in an accessible dialog", async ({ page }) => {
    await page.goto("/pt");

    const detailButtons = page.getByRole("button", { name: "Ver detalhes" });
    const count = await detailButtons.count();
    test.skip(count === 0, "No published projects available in this environment");

    await detailButtons.first().click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\?project=/);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page).not.toHaveURL(/\?project=/);
  });

  test("shows validation errors on an empty contact submission", async ({
    page,
  }) => {
    await page.goto("/pt");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByText("Informe seu nome.")).toBeVisible();
    await expect(
      page.getByText("Informe pelo menos um e-mail ou um WhatsApp."),
    ).toBeVisible();
  });

  test("submits the contact form with the Turnstile test key", async ({
    page,
  }) => {
    test.skip(
      process.env.E2E_CONTACT !== "true",
      "Requires Supabase env vars and the Turnstile test keys",
    );

    await page.goto("/pt");
    await page.getByLabel("Nome *").fill("Teste E2E");
    await page.getByRole("textbox", { name: "E-mail" }).fill("teste@example.com");
    await page
      .getByLabel("Descreva sua necessidade *")
      .fill("Mensagem de teste enviada pelo fluxo E2E.");
    await page.getByLabel(/Autorizo o armazenamento/).check();

    // Wait for the Turnstile test widget to solve itself.
    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(page.getByText("Mensagem recebida")).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("link", { name: /Continuar no WhatsApp/ }),
    ).toBeVisible();
  });

  test("shows the Wesley AI entry as coming soon", async ({ page }) => {
    await page.goto("/pt");

    // Dismiss the cookie banner, which overlays the bottom of the viewport.
    await page.getByRole("button", { name: "Somente necessários" }).click();

    const entry = page.getByRole("button", {
      name: "Abrir informações sobre a Wesley AI",
    });
    await expect(entry).toBeVisible();
    await entry.click();
    await expect(
      page.getByText(/assistente treinada com o conteúdo público/i),
    ).toBeVisible();
  });
});
