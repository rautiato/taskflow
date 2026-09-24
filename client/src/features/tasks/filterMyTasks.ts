import type { TaskItem, TaskPriority } from '../../models/task'

export const ALL = 'all' as const
export const UNKNOWN_CREATOR = 'unknown-creator' as const

export interface MyTasksFilters {
  search: string
  projectId: string | typeof ALL
  statusName: string | typeof ALL
  priority: TaskPriority | typeof ALL
  createdById: string | typeof ALL | typeof UNKNOWN_CREATOR
}

export const DEFAULT_MY_TASKS_FILTERS: MyTasksFilters = {
  search: '',
  projectId: ALL,
  statusName: ALL,
  priority: ALL,
  createdById: ALL,
}

export function hasActiveMyTasksFilters(filters: MyTasksFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.projectId !== ALL ||
    filters.statusName !== ALL ||
    filters.priority !== ALL ||
    filters.createdById !== ALL
  )
}

export function filterMyTasks(
  tasks: TaskItem[],
  filters: MyTasksFilters,
  projectIdByColumnId: Record<string, string>,
  statusNameByColumnId: Record<string, string>,
): TaskItem[] {
  const search = filters.search.trim().toLowerCase()
  return tasks.filter((task) => {
    if (
      filters.projectId !== ALL &&
      projectIdByColumnId[task.columnId] !== filters.projectId
    ) {
      return false
    }
    if (
      filters.statusName !== ALL &&
      statusNameByColumnId[task.columnId] !== filters.statusName
    ) {
      return false
    }
    if (filters.priority !== ALL && task.priority !== filters.priority) {
      return false
    }
    if (filters.createdById === UNKNOWN_CREATOR && task.createdById) {
      return false
    }
    if (
      filters.createdById !== ALL &&
      filters.createdById !== UNKNOWN_CREATOR &&
      task.createdById !== filters.createdById
    ) {
      return false
    }
    if (search && !task.title.toLowerCase().includes(search)) {
      return false
    }
    return true
  })
}
