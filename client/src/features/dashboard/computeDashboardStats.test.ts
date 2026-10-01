import { createMockColumn } from '../../test/createMockColumn'
import { createMockTask } from '../../test/createMockTask'
import { computeDashboardStats } from './computeDashboardStats'

// Noon on 15 June 2026, local time. No daylight-saving changes nearby.
const NOW = new Date(2026, 5, 15, 12)

const YESTERDAY = '2026-06-14'
const TODAY = '2026-06-15'
const IN_8_DAYS = '2026-06-23'

const columns = [
  createMockColumn({ id: 'todo', name: 'To Do' }),
  createMockColumn({ id: 'done', name: 'Done', order: 1, isDone: true }),
]

describe('computeDashboardStats', () => {
  const tasks = [
    createMockTask({ title: 'Overdue', priority: 'High', dueDate: YESTERDAY }),
    createMockTask({ title: 'Due today', priority: 'Low', dueDate: TODAY }),
    createMockTask({ title: 'No due date', priority: 'Medium' }),
    createMockTask({ title: 'Later', priority: 'High', dueDate: IN_8_DAYS }),
    // Done, with a past due date: counts as completed, never as overdue.
    createMockTask({ title: 'Finished', columnId: 'done', dueDate: YESTERDAY }),
  ]

  it('counts open, completed and assigned tasks', () => {
    const stats = computeDashboardStats(tasks, columns, NOW)

    expect(stats.open).toBe(4)
    expect(stats.completed).toBe(1)
    expect(stats.assigned).toBe(5)
  })

  it('counts only open tasks as overdue or due this week', () => {
    const stats = computeDashboardStats(tasks, columns, NOW)

    expect(stats.overdue).toBe(1)
    expect(stats.dueThisWeek).toBe(1)
  })

  it('never counts a task in both Overdue and Due this week', () => {
    const stats = computeDashboardStats(tasks, columns, NOW)

    expect(stats.overdue + stats.dueThisWeek).toBeLessThanOrEqual(stats.open)
    expect(stats.open + stats.completed).toBe(stats.assigned)
  })

  it('splits open tasks by priority, adding up to the open count', () => {
    const stats = computeDashboardStats(tasks, columns, NOW)

    expect(stats.openByPriority).toEqual({ High: 2, Medium: 1, Low: 1 })
    const { High, Medium, Low } = stats.openByPriority
    expect(High + Medium + Low).toBe(stats.open)
  })

  it('returns zeros when the user has no tasks', () => {
    expect(computeDashboardStats([], columns, NOW)).toEqual({
      open: 0,
      openByPriority: { High: 0, Medium: 0, Low: 0 },
      overdue: 0,
      dueThisWeek: 0,
      completed: 0,
      assigned: 0,
    })
  })
})
