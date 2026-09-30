import type { TaskItem, TaskPriority } from '../../models/task'
import type { ProjectStatus } from '../../models/project'
import { daysUntilDue, DUE_SOON_DAYS } from './taskDisplay'
import { writeSortToSearchParams, type SortState } from './taskListSort'

export const UNKNOWN_CREATOR = 'unknown-creator' as const
export const UNASSIGNED = 'unassigned' as const
export const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low']
export const DUE_FILTERS = ['overdue', 'today', 'next7', 'none'] as const
export type DueFilter = (typeof DUE_FILTERS)[number]
export const PROJECT_STATUS_FILTERS = ['All', 'Active', 'Closed'] as const
export type ProjectStatusFilter = (typeof PROJECT_STATUS_FILTERS)[number]

/**
 * Each filter holds a list of selected values; an empty list matches every
 * task. A task matches a filter if it has any of the selected values, and
 * it must match every filter that has a selection.
 */
export interface TaskListFilters {
  search: string
  assigneeIds: string[] // user ids, or UNASSIGNED
  projectIds: string[]
  // Single choice; 'All' matches every task.
  projectStatus: ProjectStatusFilter
  statusNames: string[]
  priorities: TaskPriority[]
  createdByIds: string[] // user ids, or UNKNOWN_CREATOR
  due: DueFilter[]
}

export const EMPTY_TASK_LIST_FILTERS: TaskListFilters = {
  search: '',
  assigneeIds: [],
  projectIds: [],
  projectStatus: 'All',
  statusNames: [],
  priorities: [],
  createdByIds: [],
  due: [],
}

export function hasActiveTaskListFilters(filters: TaskListFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.assigneeIds.length > 0 ||
    filters.projectIds.length > 0 ||
    filters.projectStatus !== 'All' ||
    filters.statusNames.length > 0 ||
    filters.priorities.length > 0 ||
    filters.createdByIds.length > 0 ||
    filters.due.length > 0
  )
}

/**
 * Shared with the dashboard tiles, so a tile's count always equals the
 * rows its link lands on.
 */
export function matchesDueFilter(
  dueDate: string | null,
  filter: DueFilter,
  now = new Date(),
): boolean {
  if (filter === 'none') return !dueDate
  if (!dueDate) return false
  const days = daysUntilDue(dueDate, now)
  switch (filter) {
    case 'overdue':
      return days < 0
    case 'today':
      return days === 0
    case 'next7':
      return days >= 0 && days <= DUE_SOON_DAYS
    default: {
      // A filter added to DUE_FILTERS but not handled here fails to compile.
      const unhandled: never = filter
      return unhandled
    }
  }
}

/**
 * Applies `TaskListFilters` across projects. Tasks only carry a column id,
 * so the caller passes lookups from column id to project id, to status
 * name and to project status. Search matches task titles only.
 */
export function filterTaskList(
  tasks: TaskItem[],
  filters: TaskListFilters,
  projectIdByColumnId: Record<string, string>,
  statusNameByColumnId: Record<string, string>,
  projectStatusByColumnId: Record<string, ProjectStatus>,
  now = new Date(),
): TaskItem[] {
  const search = filters.search.trim().toLowerCase()
  return tasks.filter((task) => {
    if (
      filters.assigneeIds.length &&
      !filters.assigneeIds.includes(task.assigneeId ?? UNASSIGNED)
    ) {
      return false
    }
    if (
      filters.projectIds.length &&
      !filters.projectIds.includes(projectIdByColumnId[task.columnId])
    ) {
      return false
    }
    if (
      filters.projectStatus !== 'All' &&
      projectStatusByColumnId[task.columnId] !== filters.projectStatus
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
  assigneeIds: 'assignee',
  projectIds: 'project',
  projectStatus: 'projectStatus',
  statusNames: 'status',
  priorities: 'priority',
  createdByIds: 'createdBy',
  due: 'due',
} as const

export function filtersFromSearchParams(
  params: URLSearchParams,
): TaskListFilters {
  return {
    search: params.get(PARAMS.search) ?? '',
    assigneeIds: params.getAll(PARAMS.assigneeIds),
    projectIds: params.getAll(PARAMS.projectIds),
    projectStatus: parseProjectStatus(params.get(PARAMS.projectStatus)),
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

function parseProjectStatus(value: string | null): ProjectStatusFilter {
  return (PROJECT_STATUS_FILTERS as readonly string[]).includes(value ?? '')
    ? (value as ProjectStatusFilter)
    : 'All'
}

export function filtersToSearchParams(
  filters: TaskListFilters,
): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set(PARAMS.search, filters.search)
  if (filters.projectStatus !== 'All') {
    params.set(PARAMS.projectStatus, filters.projectStatus)
  }
  const lists = [
    'assigneeIds',
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

/** Link to My Tasks with the given filters and sort encoded in the URL. */
export function myTasksHref(
  filters: Partial<TaskListFilters>,
  sort: SortState = null,
): string {
  const params = filtersToSearchParams({
    ...EMPTY_TASK_LIST_FILTERS,
    ...filters,
  })
  writeSortToSearchParams(params, sort)
  const query = params.toString()
  return query ? `/my-tasks?${query}` : '/my-tasks'
}
