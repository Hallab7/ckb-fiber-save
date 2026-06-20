import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3012",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command:
      "pnpm exec next build && pnpm exec next start --hostname 127.0.0.1 --port 3012",
    url: "http://127.0.0.1:3012",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_ENABLE_DEMO_MODE: "true",
    },
  },
});
