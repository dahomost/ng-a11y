import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E — accessibility scans use @axe-core/playwright against the dev server.
 * @see https://playwright.dev/docs/intro
 */
export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? 'github' : 'list',
  /** Starts/stops `ng serve` without `start-server-and-test` (avoids Windows `wmic.exe` teardown errors). */
  webServer: {
    command: 'npm run start:e2e',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
