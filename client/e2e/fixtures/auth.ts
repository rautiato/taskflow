import type { Page } from '@playwright/test'

// Seeded by the app on first load. Every test gets a fresh browser context and
// so a fresh copy of the seed data, which means this account always exists.
export const HA_TRAN = {
  name: 'Ha Tran',
  email: 'hatran@example.com',
  password: '123456',
}

export async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  // MUI appends " *" to required labels, so the label is "Password *". Anchor
  // to the start so the "Show password" button doesn't match too.
  await page.getByLabel(/^Password/).fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
}
