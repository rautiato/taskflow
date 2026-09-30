export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TaskItem {
  id: string
  columnId: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  assigneeId: string | null
  createdById: string | null
  isFavorite: boolean
  order: number
  createdAt: string
  updatedAt: string
  // When the task last moved into Done; null while it's open.
  completedAt: string | null
}
