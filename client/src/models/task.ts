export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TaskItem {
  id: string
  columnId: string
  title: string
  description: string
  priority: TaskPriority
  // A calendar date, "YYYY-MM-DD", with no time or time zone: a task due
  // on the 15th is due on the 15th wherever the user is.
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
