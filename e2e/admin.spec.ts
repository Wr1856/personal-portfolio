import { expect, test } from "@playwright/test";

test.describe("Admin protection", () => {
  test("redirects unauthenticated /admin/projetos to the login page", async ({
    page,
  }) => {
    await page.goto("/admin/projetos");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { name: /painel administrativo|admin panel/i }),
    ).toBeVisible();
  });

  test("redirects unauthenticated /admin/certificacoes and /admin/experiencias", async ({
    page,
  }) => {
    await page.goto("/admin/certificacoes");
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto("/admin/experiencias");
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("login page never leaks admin content", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByLabel(/E-mail|Email/)).toBeVisible();
    await expect(page.getByLabel(/Senha|Password/)).toBeVisible();
    await expect(page.getByText("Novo registro")).toHaveCount(0);
  });
});
