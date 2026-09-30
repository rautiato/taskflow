import type { TaskItem } from '../../models/task'
import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { Project, ProjectStatus } from '../../models/project'
import type { UserDto } from '../../models/user'

export type TaskListLookups = {
  projectIdByColumnId: Record<string, string>
  projectNameByColumnId: Record<string, string>
  statusNameByColumnId: Record<string, string>
  projectStatusByColumnId: Record<string, ProjectStatus>
  projectsWithTasks: Project[]
  creatorsWithTasks: UserDto[]
  assigneesWithTasks: UserDto[]
}

export function buildTaskListLookups({
  tasks,
  columns,
  boards,
  projects,
  users,
}: {
  tasks: TaskItem[]
  columns: KanbanColumn[]
  boards: KanbanBoard[]
  projects: Project[]
  users: UserDto[]
}): TaskListLookups {
  const boardById = new Map(boards.map((b) => [b.id, b]))
  const projectById = new Map(projects.map((p) => [p.id, p]))

  const projectIdByColumnId: Record<string, string> = {}
  const projectNameByColumnId: Record<string, string> = {}
  const statusNameByColumnId: Record<string, string> = {}
  const projectStatusByColumnId: Record<string, ProjectStatus> = {}
  for (const column of columns) {
    statusNameByColumnId[column.id] = column.name
    const board = boardById.get(column.boardId)
    const project = board && projectById.get(board.projectId)
    if (project) {
      projectIdByColumnId[column.id] = project.id
      projectNameByColumnId[column.id] = project.name
      projectStatusByColumnId[column.id] = project.status
    }
  }

  // Only projects the user actually has a task in — picking one that can
  // only ever show "no tasks match" isn't a useful filter option.
  const projectsWithTasks = projects.filter((project) =>
    tasks.some((task) => projectIdByColumnId[task.columnId] === project.id),
  )

  // Same reasoning as projectsWithTasks — only list users who actually
  // created one of these tasks.
  const creatorsWithTasks = users.filter((creator) =>
    tasks.some((task) => task.createdById === creator.id),
  )

  // Same again for the All Tasks page's Assignee filter.
  const assigneesWithTasks = users.filter((assignee) =>
    tasks.some((task) => task.assigneeId === assignee.id),
  )

  return {
    projectIdByColumnId,
    projectNameByColumnId,
    statusNameByColumnId,
    projectStatusByColumnId,
    projectsWithTasks,
    creatorsWithTasks,
    assigneesWithTasks,
  }
}

// With no project selected, statuses collapse to their name across every
// project (one "To Do", not one per project) — with projects selected,
// it narrows to just those projects' own columns, in board order. Hidden
// columns never hold tasks, so they aren't offered.
export function statusOptionsFor(
  columns: KanbanColumn[],
  projectIdByColumnId: Record<string, string>,
  selectedProjectIds: string[],
): string[] {
  const visible = columns.filter((c) => c.isVisible)
  const relevant =
    selectedProjectIds.length === 0
      ? visible
      : visible.filter((c) =>
          selectedProjectIds.includes(projectIdByColumnId[c.id]),
        )
  const seen = new Set<string>()
  const names: string[] = []
  for (const column of [...relevant].sort((a, b) => a.order - b.order)) {
    if (!seen.has(column.name)) {
      seen.add(column.name)
      names.push(column.name)
    }
  }
  return names
}
