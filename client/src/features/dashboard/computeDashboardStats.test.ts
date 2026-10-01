import type { KanbanBoard } from '../../models/kanbanBoard'
import { createMockColumn } from '../../test/createMockColumn'
import { createMockProject } from '../../test/createMockProject'
import { createMockTask } from '../../test/createMockTask'
import {
  computeDashboardStats,
  selectUpNext,
  selectYourProjects,
} from './computeDashboardStats'

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

describe('selectUpNext', () => {
  const tasks = [
    createMockTask({ title: 'No due date', priority: 'High', dueDate: null }),
    createMockTask({ title: 'Later', priority: 'Low', dueDate: '2026-06-20' }),
    createMockTask({ title: 'Overdue', dueDate: '2026-06-10' }),
    createMockTask({ title: 'Same day, Medium', dueDate: '2026-06-18' }),
    createMockTask({
      title: 'Same day, High',
      priority: 'High',
      dueDate: '2026-06-18',
    }),
    createMockTask({
      title: 'Finished',
      columnId: 'done',
      dueDate: '2026-06-01',
    }),
  ]

  it('orders open tasks by due date, then priority, with undated tasks last', () => {
    expect(selectUpNext(tasks, columns).map((t) => t.title)).toEqual([
      'Overdue',
      'Same day, High',
      'Same day, Medium',
      'Later',
      'No due date',
    ])
  })

  it('returns at most `limit` tasks', () => {
    expect(selectUpNext(tasks, columns, 2).map((t) => t.title)).toEqual([
      'Overdue',
      'Same day, High',
    ])
  })
})

describe('selectYourProjects', () => {
  // One board per project; "alpha" also has a Done column.
  const boards: KanbanBoard[] = [
    'alpha',
    'beta',
    'gamma',
    'delta',
    'closed',
    'finished',
  ].map((projectId) => ({ id: `${projectId}-board`, projectId, name: 'Board' }))
  const projectColumns = [
    createMockColumn({ id: 'alpha-todo', boardId: 'alpha-board' }),
    createMockColumn({
      id: 'alpha-done',
      boardId: 'alpha-board',
      isDone: true,
    }),
    createMockColumn({ id: 'beta-todo', boardId: 'beta-board' }),
    createMockColumn({ id: 'gamma-todo', boardId: 'gamma-board' }),
    createMockColumn({ id: 'delta-todo', boardId: 'delta-board' }),
    createMockColumn({ id: 'closed-todo', boardId: 'closed-board' }),
    createMockColumn({
      id: 'finished-done',
      boardId: 'finished-board',
      isDone: true,
    }),
  ]
  const projects = [
    createMockProject({ id: 'alpha', updatedAt: '2026-06-10T12:00:00.000Z' }),
    createMockProject({ id: 'beta', updatedAt: '2026-06-14T12:00:00.000Z' }),
    createMockProject({ id: 'gamma', updatedAt: '2026-06-12T12:00:00.000Z' }),
    createMockProject({ id: 'delta', updatedAt: '2026-06-01T12:00:00.000Z' }),
    createMockProject({
      id: 'closed',
      status: 'Closed',
      updatedAt: '2026-06-15T12:00:00.000Z',
    }),
    createMockProject({
      id: 'finished',
      updatedAt: '2026-06-16T12:00:00.000Z',
    }),
  ]
  const tasks = [
    createMockTask({ title: 'Alpha 1', columnId: 'alpha-todo' }),
    createMockTask({ title: 'Alpha 2', columnId: 'alpha-todo' }),
    createMockTask({ title: 'Alpha done', columnId: 'alpha-done' }),
    createMockTask({ title: 'Beta 1', columnId: 'beta-todo' }),
    createMockTask({ title: 'Gamma 1', columnId: 'gamma-todo' }),
    createMockTask({ title: 'Delta 1', columnId: 'delta-todo' }),
    createMockTask({ title: 'Closed 1', columnId: 'closed-todo' }),
    createMockTask({ title: 'Finished 1', columnId: 'finished-done' }),
  ]

  function select(limit?: number) {
    return selectYourProjects(tasks, projectColumns, boards, projects, limit)
  }

  it('shows the 3 most recently updated active projects with open tasks', () => {
    expect(select().map((p) => p.project.id)).toEqual([
      'beta',
      'gamma',
      'alpha',
    ])
  })

  it('leaves out closed projects and projects with only finished tasks', () => {
    const ids = select(10).map((p) => p.project.id)

    expect(ids).toEqual(['beta', 'gamma', 'alpha', 'delta'])
  })

  it("counts only the user's open tasks in each project", () => {
    const alpha = select().find((p) => p.project.id === 'alpha')

    expect(alpha?.myOpenCount).toBe(2)
  })
})
