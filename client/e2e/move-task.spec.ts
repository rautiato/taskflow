import { expect, test } from '@playwright/test'
import {
  createProject,
  createTask,
  taskCard,
  taskCell,
  uniqueName,
} from './fixtures/board'

test.describe('Moving tasks', () => {
  test.beforeEach(async ({ page }) => {
    await createProject(page, uniqueName('E2E project'))
  })

  test('a task dragged to another column stays there after a reload', async ({
    page,
  }) => {
    const title = uniqueName('E2E task')
    await createTask(page, title)

    // Keyboard drag (Space to lift, arrow to move, Space to drop) is built
    // into @hello-pangea/dnd and far less flaky than simulated mouse drags.
    // The card's wrapper is the drag handle.
    const handle = taskCard(page, title).locator('..')
    const target = taskCell(page, 'In Progress')

    await handle.press('Space')
    // Each step waits for the board to report the drag state before the next
    // key, so keys never arrive mid-transition.
    await expect(handle).toHaveAttribute('data-dragging', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(target).toHaveAttribute('data-drag-over', 'true')
    await page.keyboard.press('Space')

    await expect(target.getByText(title)).toBeVisible()
    await expect(taskCell(page, 'To Do').getByText(title)).toHaveCount(0)

    await page.reload()
    await expect(taskCell(page, 'In Progress').getByText(title)).toBeVisible()
  })
})
