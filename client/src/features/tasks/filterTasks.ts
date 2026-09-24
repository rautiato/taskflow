import type { TaskItem, TaskPriority } from '../../models/task'

export const ALL = 'all' as const
export const UNASSIGNED = 'unassigned' as const

export interface TaskFilters {
  search: string
  columnId: string | typeof ALL
  priority: TaskPriority | typeof ALL
  assigneeId: string | typeof ALL | typeof UNASSIGNED
}

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: '',
  columnId: ALL,
  priority: ALL,
  assigneeId: ALL,
}

export function hasActiveFilters(filters: TaskFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.columnId !== ALL ||
    filters.priority !== ALL ||
    filters.assigneeId !== ALL
  )
}

export function filterTasks(
  tasks: TaskItem[],
  filters: TaskFilters,
): TaskItem[] {
  const search = filters.search.trim().toLowerCase()
  return tasks.filter((task) => {
    if (filters.columnId !== ALL && task.columnId !== filters.columnId) {
      return false
    }
    if (filters.priority !== ALL && task.priority !== filters.priority) {
      return false
    }
    if (filters.assigneeId === UNASSIGNED && task.assigneeId !== null) {
      return false
    }
    if (
      filters.assigneeId !== ALL &&
      filters.assigneeId !== UNASSIGNED &&
      task.assigneeId !== filters.assigneeId
    ) {
      return false
    }
    if (search && !task.title.toLowerCase().includes(search)) {
      return false
    }
    return true
  })
}
