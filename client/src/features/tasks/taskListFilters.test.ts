import { createMockTask } from '../../test/createMockTask'
import type { ProjectStatus } from '../../models/project'
import {
  EMPTY_TASK_LIST_FILTERS,
  UNASSIGNED,
  filterTaskList,
  matchesDueFilter,
  type DueFilter,
  type TaskListFilters,
} from './taskListFilters'

// Noon on 15 June 2026, local time. No daylight-saving changes nearby.
const NOW = new Date(2026, 5, 15, 12)

// Due dates are calendar dates, the way the task form saves them.
const YESTERDAY = '2026-06-14'
const TODAY = '2026-06-15'
const TOMORROW = '2026-06-16'
const IN_7_DAYS = '2026-06-22'
const IN_8_DAYS = '2026-06-23'

describe('matchesDueFilter', () => {
  it.each<[DueFilter, string | null, boolean]>([
    ['overdue', YESTERDAY, true],
    ['overdue', TODAY, false],
    ['today', TODAY, true],
    ['today', YESTERDAY, false],
    ['today', TOMORROW, false],
    ['next7', TODAY, true],
    ['next7', IN_7_DAYS, true],
    ['next7', IN_8_DAYS, false],
    ['next7', YESTERDAY, false],
    ['none', null, true],
    ['none', TODAY, false],
  ])('%s with due date %s → %s', (filter, dueDate, expected) => {
    expect(matchesDueFilter(dueDate, filter, NOW)).toBe(expected)
  })

  it('never matches a task without a due date to a date-based filter', () => {
    expect(matchesDueFilter(null, 'overdue', NOW)).toBe(false)
    expect(matchesDueFilter(null, 'today', NOW)).toBe(false)
    expect(matchesDueFilter(null, 'next7', NOW)).toBe(false)
  })
})

describe('filterTaskList', () => {
  // Two projects: "Website" (active) and "Archive" (closed).
  const projectIdByColumnId = {
    todo: 'website',
    done: 'website',
    old: 'archive',
  }
  const statusNameByColumnId = { todo: 'To Do', done: 'Done', old: 'To Do' }
  const projectStatusByColumnId: Record<string, ProjectStatus> = {
    todo: 'Active',
    done: 'Active',
    old: 'Closed',
  }

  const tasks = [
    createMockTask({
      title: 'Write homepage copy',
      priority: 'High',
      assigneeId: 'ann',
      dueDate: YESTERDAY,
    }),
    createMockTask({
      title: 'Fix login bug',
      priority: 'Low',
      assigneeId: null,
      dueDate: TODAY,
    }),
    createMockTask({
      title: 'Release homepage',
      columnId: 'done',
      priority: 'Medium',
      assigneeId: 'bob',
    }),
    createMockTask({
      title: 'Old report',
      columnId: 'old',
      priority: 'High',
      assigneeId: 'ann',
    }),
  ]

  function filter(overrides: Partial<TaskListFilters>) {
    const result = filterTaskList(
      tasks,
      { ...EMPTY_TASK_LIST_FILTERS, ...overrides },
      projectIdByColumnId,
      statusNameByColumnId,
      projectStatusByColumnId,
      NOW,
    )
    return result.map((t) => t.title)
  }

  it('returns every task when no filter is set', () => {
    expect(filter({})).toHaveLength(tasks.length)
  })

  it('searches titles, ignoring case and surrounding spaces', () => {
    expect(filter({ search: '  HOMEPAGE ' })).toEqual([
      'Write homepage copy',
      'Release homepage',
    ])
  })

  it('matches any of the selected priorities', () => {
    expect(filter({ priorities: ['High', 'Low'] })).toEqual([
      'Write homepage copy',
      'Fix login bug',
      'Old report',
    ])
  })

  it('filters by status name across projects', () => {
    expect(filter({ statusNames: ['Done'] })).toEqual(['Release homepage'])
  })

  it('matches unassigned tasks with the Unassigned option', () => {
    expect(filter({ assigneeIds: [UNASSIGNED, 'bob'] })).toEqual([
      'Fix login bug',
      'Release homepage',
    ])
  })

  it('matches any of the selected due-date options', () => {
    expect(filter({ due: ['overdue', 'none'] })).toEqual([
      'Write homepage copy',
      'Release homepage',
      'Old report',
    ])
  })

  it('filters by project status', () => {
    expect(filter({ projectStatus: 'Closed' })).toEqual(['Old report'])
  })

  it('requires a task to match every filter that is set', () => {
    expect(filter({ priorities: ['High'], projectStatus: 'Active' })).toEqual([
      'Write homepage copy',
    ])
  })
})
