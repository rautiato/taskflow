import type { TaskItem, TaskPriority } from '../../models/task'
import type { KanbanColumn } from '../../models/kanbanBoard'
import { getDoneColumnIds } from '../tasks/taskDisplay'
import { matchesDueFilter } from '../tasks/filterMyTasks'

export type DashboardStats = {
  open: number
  openByPriority: Record<TaskPriority, number>
  overdue: number
  dueThisWeek: number
  completed: number
  assigned: number
}

// Pure: derives the dashboard tiles from the tasks assigned to the user.
// A task is done when its column is a Done column; TaskItem has no status
// field of its own (PLAN.md §4.4). Each count is one clear thing — no
// count is a hidden subset of another tile's number.
export function computeDashboardStats(
  tasks: TaskItem[],
  columns: KanbanColumn[],
  now = new Date(),
): DashboardStats {
  const doneColumnIds = getDoneColumnIds(columns)
  const openTasks = tasks.filter((t) => !doneColumnIds.has(t.columnId))
  const openByPriority: Record<TaskPriority, number> = {
    High: 0,
    Medium: 0,
    Low: 0,
  }
  for (const task of openTasks) openByPriority[task.priority] += 1

  return {
    open: openTasks.length,
    openByPriority,
    overdue: openTasks.filter((t) =>
      matchesDueFilter(t.dueDate, 'overdue', now),
    ).length,
    dueThisWeek: openTasks.filter((t) =>
      matchesDueFilter(t.dueDate, 'next7', now),
    ).length,
    completed: tasks.length - openTasks.length,
    assigned: tasks.length,
  }
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
}

// Next open tasks for the "Up next" list: earliest due date first (so
// overdue tasks lead), undated tasks last, higher priority breaking ties.
export function selectUpNext(
  tasks: TaskItem[],
  columns: KanbanColumn[],
  limit = 5,
): TaskItem[] {
  const doneColumnIds = getDoneColumnIds(columns)
  return tasks
    .filter((t) => !doneColumnIds.has(t.columnId))
    .sort((a, b) => {
      if (a.dueDate !== b.dueDate) {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate < b.dueDate ? -1 : 1
      }
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
    })
    .slice(0, limit)
}
