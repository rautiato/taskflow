import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI
const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`
// auth.setup.ts signs in once and saves the session (cookie + localStorage)
// here. Every test in the chromium project starts from it, so specs begin
// already signed in. Relative to client/, where the yarn scripts run.
const AUTH_FILE = 'e2e/.auth/user.json'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,

  // CI: `list` prints one line per test in the job log; `github` shows
  // failures as annotations on the PR; `html` builds the report uploaded as
  // an artifact (`open: 'never'`, since there's no browser in CI). Locally:
  // the HTML report opens automatically when a test fails.
  reporter: isCI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'html',

  // Defaults for every test in every project.
  use: {
    // Lets tests write `page.goto('/tasks')` instead of the full URL.
    baseURL: BASE_URL,
    timezoneId: 'America/Toronto',

    // Record a trace (DOM snapshots, network, console at every step) when a
    // test is retried, i.e. only for failures in CI. Open it with
    // `npx playwright show-trace` or from the HTML report.
    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    // Record video for every test but keep it only for failures.
    video: 'retain-on-failure',
  },

  projects: [
    {
      // All *.spec.ts files, in desktop Chrome, starting signed in.
      // It's first in this list only so UI Mode shows it by default.
      // `dependencies` below still makes setup run before it.
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    // Signs in once (auth.setup.ts) and saves the session, so the
    // specs above don't each have to sign in.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
  ],

  // Starts the app before the tests and stops it afterwards.
  webServer: {
    // Production build + static server, closer to what users get than the
    // dev server. `vite build` skips `yarn build`'s `tsc -b`, since the CI
    // check job already type-checks. --strictPort fails fast if 4173 is taken
    // instead of silently moving to another port the tests don't know about.
    command: `yarn vite build && yarn vite preview --port ${PORT} --strictPort`,

    // Playwright waits until this URL responds before starting tests.
    url: BASE_URL,

    // Locally, reuse a server already running on 4173 (skips the rebuild).
    // In CI, always build fresh.
    reuseExistingServer: !isCI,

    // Max wait for build + server start. A cold CI build can take longer than the 60 s default.
    timeout: 120_000,
  },
})
