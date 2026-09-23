export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TaskItem {
  id: string
  columnId: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  assigneeId: string | null
  isFavorite: boolean
  order: number
  createdAt: string
  updatedAt: string
}
