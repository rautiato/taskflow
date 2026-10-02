import { expect, type Page } from '@playwright/test'

// Each test creates its own data under a unique name instead of relying on
// seed records, so tests don't depend on each other or on the seed contents.
export function uniqueName(prefix: string) {
  return `${prefix} ${Date.now()}`
}

// Creates a project through the UI. The app then opens its board, which
// starts empty with the default To Do / In Progress / Done columns.
export async function createProject(page: Page, name: string) {
  await page.goto('/projects')
  await page.getByRole('button', { name: 'New Project' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel(/^Project Name/).fill(name)
  await dialog.getByRole('button', { name: 'Create Project' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name, exact: true }),
  ).toBeVisible()
}

// Adds an unassigned task to the To Do column of the open board.
export async function createTask(page: Page, title: string) {
  await page.getByRole('button', { name: 'New task in To Do' }).click()
  const dialog = page.getByRole('dialog')
  // Anchored: MUI appends " *" to required labels.
  await dialog.getByLabel(/^Task Title/).fill(title)
  await dialog.getByLabel(/^Description/).fill(`Created by E2E test: ${title}`)
  await dialog.getByRole('button', { name: 'Save Task' }).click()

  await expect(dialog).toBeHidden()
  await expect(taskCell(page, 'To Do').getByText(title)).toBeVisible()
}

// A board cell: one column within one assignee's lane.
export function taskCell(page: Page, column: string, lane = 'Unassigned') {
  return page.getByRole('group', { name: `${lane}, ${column}` })
}

export function taskCard(page: Page, title: string) {
  return page.getByTestId('task-card').filter({ hasText: title })
}
