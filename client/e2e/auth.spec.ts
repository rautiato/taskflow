import { expect, test } from '@playwright/test'
import { HA_TRAN, signIn } from './fixtures/auth'

const SIGNED_OUT = { cookies: [], origins: [] }

test.describe('Sign in', () => {
  test.use({ storageState: SIGNED_OUT })

  test('lands on the dashboard with valid credentials', async ({ page }) => {
    await signIn(page, HA_TRAN.email, HA_TRAN.password)

    await expect(page).toHaveURL('/dashboard')
    await expect(
      page.getByRole('button', { name: 'Account menu' }),
    ).toBeVisible()
  })

  test('shows an error and stays on sign in with a wrong password', async ({
    page,
  }) => {
    await signIn(page, HA_TRAN.email, 'wrong-password')

    await expect(page.getByText('Incorrect email or password.')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Protected pages', () => {
  test.use({ storageState: SIGNED_OUT })

  test('redirect to sign in when signed out', async ({ page }) => {
    await page.goto('/projects')

    await expect(page).toHaveURL('/login')
  })
})

test.describe('Sign out', () => {
  test('clears the session and blocks protected pages', async ({
    page,
    context,
  }) => {
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Account menu' }).click()
    await page.getByRole('menuitem', { name: 'Log out' }).click()

    await expect(page).toHaveURL('/login')
    // The URL changes before React renders the new page. Wait for the sign-in
    // form so Back doesn't interrupt that render (seen flaky in CI).
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
    const cookies = await context.cookies()
    expect(cookies.map((cookie) => cookie.name)).not.toContain(
      'taskflow.session',
    )

    // Back returns to /dashboard in history, which must bounce to sign in.
    await page.goBack()
    await expect(page).toHaveURL('/login')

    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
