import type { TaskItem, TaskPriority } from '../../models/task'
import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { Project } from '../../models/project'
import { getDoneColumnIds } from '../tasks/taskDisplay'
import { matchesDueFilter } from '../tasks/taskListFilters'

export type DashboardStats = {
  open: number
  openByPriority: Record<TaskPriority, number>
  overdue: number
  dueThisWeek: number
  completed: number
  assigned: number
}

/**
 * Derives the dashboard tiles from the tasks assigned to the user.
 */
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

/**
 * Next open tasks for the "Your next tasks" list: earliest due date first (so
 * overdue tasks lead), undated tasks last, higher priority breaking ties.
 */
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

export type YourProject = { project: Project; myOpenCount: number }

/**
 * Projects for the "Your projects" section. It's personal, like the rest of
 * the dashboard: active projects where the user has at least one open task,
 * most recently updated first. (Prod apps show "recently viewed" here — the
 * natural upgrade once a backend can record views.)
 */
export function selectYourProjects(
  tasks: TaskItem[],
  columns: KanbanColumn[],
  boards: KanbanBoard[],
  projects: Project[],
  limit = 3,
): YourProject[] {
  const doneColumnIds = getDoneColumnIds(columns)
  const projectIdByColumnId = new Map(
    columns.map((c) => [
      c.id,
      boards.find((b) => b.id === c.boardId)?.projectId,
    ]),
  )
  const myOpenCountByProjectId = new Map<string, number>()
  for (const task of tasks) {
    if (doneColumnIds.has(task.columnId)) continue
    const projectId = projectIdByColumnId.get(task.columnId)
    if (projectId) {
      myOpenCountByProjectId.set(
        projectId,
        (myOpenCountByProjectId.get(projectId) ?? 0) + 1,
      )
    }
  }
  return projects
    .filter((p) => p.status === 'Active' && myOpenCountByProjectId.has(p.id))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit)
    .map((project) => ({
      project,
      myOpenCount: myOpenCountByProjectId.get(project.id) ?? 0,
    }))
}
