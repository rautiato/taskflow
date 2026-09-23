import type { TaskItem } from '../../models/task'
import type { UserDto } from '../../models/user'
import { sortTasks } from './sortTasks'

export interface AssigneeLaneData {
  assigneeId: string | null
  assigneeName: string
  tasksByColumn: Record<string, TaskItem[]>
  taskCount: number
}

export function groupTasksByAssignee(
  tasks: TaskItem[],
  users: UserDto[],
): AssigneeLaneData[] {
  const byAssignee = new Map<string | null, TaskItem[]>()
  for (const task of tasks) {
    byAssignee.set(task.assigneeId, [
      ...(byAssignee.get(task.assigneeId) ?? []),
      task,
    ])
  }

  const lanes: AssigneeLaneData[] = []
  for (const [assigneeId, laneTasks] of byAssignee) {
    const assigneeName =
      users.find((u) => u.id === assigneeId)?.name ?? 'Unassigned'
    const tasksByColumn: Record<string, TaskItem[]> = {}
    for (const task of laneTasks) {
      tasksByColumn[task.columnId] = sortTasks([
        ...(tasksByColumn[task.columnId] ?? []),
        task,
      ])
    }
    lanes.push({
      assigneeId,
      assigneeName,
      tasksByColumn,
      taskCount: laneTasks.length,
    })
  }

  return lanes.sort((a, b) => {
    if (a.assigneeId === null) return 1
    if (b.assigneeId === null) return -1
    return a.assigneeName.localeCompare(b.assigneeName)
  })
}
