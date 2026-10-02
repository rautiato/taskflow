import { expect, test } from '@playwright/test'
import { createProject, createTask, uniqueName } from './fixtures/board'

test.describe('All Tasks', () => {
  test('searching by title narrows the list and clearing restores it', async ({
    page,
  }) => {
    const title = uniqueName('E2E searchable task')
    await createProject(page, uniqueName('E2E project'))
    await createTask(page, title)

    await page.goto('/tasks')
    // Rows have no table role, so they're found by test ID.
    const rows = page.getByTestId('task-row')
    await expect(rows.first()).toBeVisible()
    const total = await rows.count()
    expect(total).toBeGreaterThan(1)

    const search = page.getByRole('textbox', { name: 'Search tasks' })
    await search.fill(title)
    await expect(rows).toHaveCount(1)
    await expect(rows).toContainText(title)

    await search.clear()
    await expect(rows).toHaveCount(total)
  })
})
