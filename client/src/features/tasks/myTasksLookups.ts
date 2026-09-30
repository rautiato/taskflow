import type { TaskItem } from '../../models/task'
import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { Project } from '../../models/project'
import type { UserDto } from '../../models/user'

export type MyTasksLookups = {
  projectIdByColumnId: Record<string, string>
  projectNameByColumnId: Record<string, string>
  statusNameByColumnId: Record<string, string>
  projectsWithMyTasks: Project[]
  creatorsWithMyTasks: UserDto[]
}

export function buildMyTasksLookups({
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
}): MyTasksLookups {
  const boardById = new Map(boards.map((b) => [b.id, b]))
  const projectById = new Map(projects.map((p) => [p.id, p]))

  const projectIdByColumnId: Record<string, string> = {}
  const projectNameByColumnId: Record<string, string> = {}
  const statusNameByColumnId: Record<string, string> = {}
  for (const column of columns) {
    statusNameByColumnId[column.id] = column.name
    const board = boardById.get(column.boardId)
    const project = board && projectById.get(board.projectId)
    if (project) {
      projectIdByColumnId[column.id] = project.id
      projectNameByColumnId[column.id] = project.name
    }
  }

  // Only projects the user actually has a task in — picking one that can
  // only ever show "no tasks match" isn't a useful filter option.
  const projectsWithMyTasks = projects.filter((project) =>
    tasks.some((task) => projectIdByColumnId[task.columnId] === project.id),
  )

  // Same reasoning as projectsWithMyTasks — only list users who actually
  // created one of these tasks.
  const creatorsWithMyTasks = users.filter((creator) =>
    tasks.some((task) => task.createdById === creator.id),
  )

  return {
    projectIdByColumnId,
    projectNameByColumnId,
    statusNameByColumnId,
    projectsWithMyTasks,
    creatorsWithMyTasks,
  }
}

// With no project selected, statuses collapse to their name across every
// project (one "To Do", not one per project) — with projects selected,
// it narrows to just those projects' own columns, in board order.
export function statusOptionsFor(
  columns: KanbanColumn[],
  projectIdByColumnId: Record<string, string>,
  selectedProjectIds: string[],
): string[] {
  const relevant =
    selectedProjectIds.length === 0
      ? columns
      : columns.filter((c) =>
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
