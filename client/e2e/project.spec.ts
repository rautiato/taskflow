import { expect, test } from '@playwright/test'
import { createProject, uniqueName } from './fixtures/board'

test.describe('Projects', () => {
  test('a new project appears in the list and opens its board', async ({
    page,
  }) => {
    const name = uniqueName('E2E project')
    await createProject(page, name)

    await page.goto('/projects')
    const row = page.getByTestId('project-row').filter({ hasText: name })
    await expect(row).toBeVisible()

    await row.click()
    await expect(page).toHaveURL(/\/projects\/[\w-]+\/board$/)
    await expect(
      page.getByRole('heading', { level: 1, name, exact: true }),
    ).toBeVisible()
    await expect(page.getByTestId('column-header-name')).toHaveText([
      'To Do',
      'In Progress',
      'Done',
    ])
    await expect(page.getByText('No tasks yet')).toBeVisible()
  })
})
