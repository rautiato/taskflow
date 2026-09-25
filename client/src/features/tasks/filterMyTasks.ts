import type { TaskItem, TaskPriority } from '../../models/task'
import { daysUntilDue, DUE_SOON_DAYS } from './taskDisplay'
import { writeSortToSearchParams, type SortState } from './taskListSort'

export const UNKNOWN_CREATOR = 'unknown-creator' as const
export const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low']
export const DUE_FILTERS = ['overdue', 'today', 'next7', 'none'] as const
export type DueFilter = (typeof DUE_FILTERS)[number]

// Every filter is a list; an empty list means "any". Values within one
// filter are OR'd, different filters are AND'd — the Jira/Linear model.
export interface MyTasksFilters {
  search: string
  projectIds: string[]
  statusNames: string[]
  priorities: TaskPriority[]
  createdByIds: string[] // user ids, or UNKNOWN_CREATOR
  due: DueFilter[]
}

export const EMPTY_MY_TASKS_FILTERS: MyTasksFilters = {
  search: '',
  projectIds: [],
  statusNames: [],
  priorities: [],
  createdByIds: [],
  due: [],
}

export function hasActiveMyTasksFilters(filters: MyTasksFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.projectIds.length > 0 ||
    filters.statusNames.length > 0 ||
    filters.priorities.length > 0 ||
    filters.createdByIds.length > 0 ||
    filters.due.length > 0
  )
}

// Shared with the dashboard tiles, so a tile's count always equals the
// rows its link lands on.
export function matchesDueFilter(
  dueDate: string | null,
  filter: DueFilter,
  now = new Date(),
): boolean {
  if (filter === 'none') return !dueDate
  if (!dueDate) return false
  const days = daysUntilDue(dueDate, now)
  if (filter === 'overdue') return days < 0
  if (filter === 'today') return days === 0
  return days >= 0 && days <= DUE_SOON_DAYS
}

export function filterMyTasks(
  tasks: TaskItem[],
  filters: MyTasksFilters,
  projectIdByColumnId: Record<string, string>,
  statusNameByColumnId: Record<string, string>,
  now = new Date(),
): TaskItem[] {
  const search = filters.search.trim().toLowerCase()
  return tasks.filter((task) => {
    if (
      filters.projectIds.length &&
      !filters.projectIds.includes(projectIdByColumnId[task.columnId])
    ) {
      return false
    }
    if (
      filters.statusNames.length &&
      !filters.statusNames.includes(statusNameByColumnId[task.columnId])
    ) {
      return false
    }
    if (
      filters.priorities.length &&
      !filters.priorities.includes(task.priority)
    ) {
      return false
    }
    if (
      filters.createdByIds.length &&
      !filters.createdByIds.includes(task.createdById ?? UNKNOWN_CREATOR)
    ) {
      return false
    }
    if (
      filters.due.length &&
      !filters.due.some((due) => matchesDueFilter(task.dueDate, due, now))
    ) {
      return false
    }
    if (search && !task.title.toLowerCase().includes(search)) {
      return false
    }
    return true
  })
}

// Filters <-> URL. Lists are repeated params (?status=To+Do&status=Done)
// so values containing commas survive.
const PARAMS = {
  search: 'q',
  projectIds: 'project',
  statusNames: 'status',
  priorities: 'priority',
  createdByIds: 'createdBy',
  due: 'due',
} as const

export function filtersFromSearchParams(
  params: URLSearchParams,
): MyTasksFilters {
  return {
    search: params.get(PARAMS.search) ?? '',
    projectIds: params.getAll(PARAMS.projectIds),
    statusNames: params.getAll(PARAMS.statusNames),
    priorities: params
      .getAll(PARAMS.priorities)
      .filter((p): p is TaskPriority => PRIORITIES.includes(p as TaskPriority)),
    createdByIds: params.getAll(PARAMS.createdByIds),
    due: params
      .getAll(PARAMS.due)
      .filter((d): d is DueFilter =>
        (DUE_FILTERS as readonly string[]).includes(d),
      ),
  }
}

export function filtersToSearchParams(
  filters: MyTasksFilters,
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set(PARAMS.search, filters.search)
  const lists = [
    'projectIds',
    'statusNames',
    'priorities',
    'createdByIds',
    'due',
  ] as const
  for (const key of lists) {
    for (const value of filters[key]) params.append(PARAMS[key], value)
  }
  return params
}

export function myTasksHref(
  filters: Partial<MyTasksFilters>,
  sort: SortState = null,
): string {
  const params = filtersToSearchParams({ ...EMPTY_MY_TASKS_FILTERS, ...filters })
  writeSortToSearchParams(params, sort)
  const query = params.toString()
  return query ? `/my-tasks?${query}` : '/my-tasks'
}
