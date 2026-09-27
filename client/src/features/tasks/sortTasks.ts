import type { TaskItem, TaskPriority } from '../../models/task'

export const PRIORITY_RANK: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
}

/**
 * Favorites first, then High → Low priority, then title A–Z. Returns a new array.
 */
export function sortTasks(tasks: TaskItem[]): TaskItem[] {
  return [...tasks].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1
    }
    const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    if (priorityDiff !== 0) {
      return priorityDiff
    }
    return a.title.localeCompare(b.title)
  })
}
