import { defineConfig, devices } from '@playwright/test';

/**
 * Deterministic browser E2E: the real React app runs in Chromium, but API
 * responses are intercepted by Playwright. This is NOT a real DB/backend test.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Dedicated local fake API prefix; never hits real backend in this suite.
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/login',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { VITE_API_URL: 'http://127.0.0.1:4173/__api' },
  },
});
