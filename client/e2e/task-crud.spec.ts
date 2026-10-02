import { expect, test } from '@playwright/test'
import {
  createProject,
  createTask,
  taskCard,
  taskCell,
  uniqueName,
} from './fixtures/board'

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await createProject(page, uniqueName('E2E project'))
  })

  test('a new task appears on the board and survives a reload', async ({
    page,
  }) => {
    const title = uniqueName('E2E task')
    await createTask(page, title)

    await page.reload()
    await expect(taskCell(page, 'To Do').getByText(title)).toBeVisible()
  })

  test('editing a task updates its card', async ({ page }) => {
    const title = uniqueName('E2E task')
    const newTitle = `${title} (edited)`
    await createTask(page, title)

    // exact: true, because the card's drag wrapper also counts as a button,
    // and its name includes "Edit <title>" from the Edit button inside it.
    // Without exact, both would match. (Same for Delete below.)
    await page
      .getByRole('button', { name: `Edit ${title}`, exact: true })
      .click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel(/^Task Title/).fill(newTitle)
    await dialog.getByRole('combobox', { name: /^Priority/ }).click()
    // The options list opens in a popup outside the dialog.
    await page.getByRole('option', { name: 'High' }).click()
    await dialog.getByRole('button', { name: 'Save Task' }).click()

    await expect(dialog).toBeHidden()
    const card = taskCard(page, newTitle)
    await expect(card).toBeVisible()
    await expect(card.getByTestId('priority-chip')).toHaveText('High')
  })

  test('deleting a task removes its card', async ({ page }) => {
    const title = uniqueName('E2E task')
    await createTask(page, title)

    await page
      .getByRole('button', { name: `Delete ${title}`, exact: true })
      .click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Delete', exact: true })
      .click()

    await expect(taskCard(page, title)).toHaveCount(0)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(taskCard(page, title)).toHaveCount(0)
  })
})
