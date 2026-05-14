import { defineConfig, devices } from "@playwright/test";

/**
 * E2E smoke — Vite dédié (port 5174 par défaut) pour ne pas réutiliser un `npm run dev` sur :5173
 * avec cache `.vite` cassé (504 « Outdated Optimize Dep »).
 * - CI : `npx playwright install chromium` (binaires ms-playwright).
 * - Local sans install (ex. TLS) : Chrome/Edge via `PLAYWRIGHT_CHANNEL` (défaut hors CI : `chrome`).
 *   Binaires Playwright : `PLAYWRIGHT_USE_PLAYWRIGHT_BROWSER=1` puis `npx playwright install chromium`.
 * - URL : `PLAYWRIGHT_BASE_URL` ou `http://localhost:${PLAYWRIGHT_E2E_PORT}` (défaut 5174).
 */
const usePlaywrightDownloadedBrowser =
  !!process.env.CI || process.env.PLAYWRIGHT_USE_PLAYWRIGHT_BROWSER === "1";

const e2ePort = Number(process.env.PLAYWRIGHT_E2E_PORT || "5174") || 5174;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${e2ePort}`;

/** Préremplit le localStorage avant toute navigation (addInitScript seul peut arriver trop tard pour le 1er rendu React). */
function welcomeBypassStorageState(base) {
  let origin;
  try {
    origin = new URL(base).origin;
  } catch {
    origin = `http://localhost:${e2ePort}`;
  }
  return {
    cookies: [],
    origins: [
      {
        origin,
        localStorage: [{ name: "egor69:firstVisitWelcomeCompleted:v1", value: "1" }],
      },
    ],
  };
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    storageState: welcomeBypassStorageState(baseURL),
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(!usePlaywrightDownloadedBrowser
          ? {
              channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
            }
          : {}),
      },
    },
  ],
  webServer: {
    /** Port dédié + `--force` : évite 504 « Outdated Optimize Dep » et un vieux Vite sur :5173. */
    command: `npm run dev -- --force --port ${e2ePort}`,
    url: `http://localhost:${e2ePort}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
