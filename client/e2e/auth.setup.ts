import { expect, test as setup } from '@playwright/test'
import { HA_TRAN, signIn } from './fixtures/auth'

// Must match AUTH_FILE in playwright.config.ts.
const AUTH_FILE = 'e2e/.auth/user.json'

setup('sign in as Ha Tran', async ({ page }) => {
  await signIn(page, HA_TRAN.email, HA_TRAN.password)
  await expect(page).toHaveURL('/dashboard')

  // Saves the session cookie and the seeded localStorage, so every spec in
  // the chromium project starts signed in.
  await page.context().storageState({ path: AUTH_FILE })
})
