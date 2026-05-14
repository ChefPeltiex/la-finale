import { test, expect } from "@playwright/test";

/** Évite le volet première visite qui bloque la navigation. */
async function bypassWelcomeGate(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("egor69:firstVisitWelcomeCompleted:v1", "1");
    } catch {
      /* ignore */
    }
  });
}

test.describe("Smoke — 5 parcours publics", () => {
  test.beforeEach(async ({ page }) => {
    await bypassWelcomeGate(page);
  });

  test("1 — Accueil / charge sans erreur critique", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    expect(errors, `pageerror: ${errors.join("; ")}`).toHaveLength(0);
  });

  test("2 — Marketplace", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page).toHaveURL(/\/marketplace/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("3 — Mentions légales", async ({ page }) => {
    await page.goto("/legal");
    await expect(page).toHaveURL(/\/legal/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("4 — Charte", async ({ page }) => {
    await page.goto("/charte");
    await expect(page).toHaveURL(/\/charte/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("5 — Carte du site (navigation structurée)", async ({ page }) => {
    await page.goto("/carte-site");
    await expect(page).toHaveURL(/\/carte-site/);
    // Route lazy (chunk) : sous workers parallèles le h1 peut dépasser le défaut 5 s.
    await expect(page.getByRole("heading", { level: 1, name: /carte du site/i })).toBeVisible({
      timeout: 15_000,
    });
  });
});
