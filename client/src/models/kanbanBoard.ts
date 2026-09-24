export interface KanbanBoard {
  id: string
  projectId: string
  name: string
}

export interface KanbanColumn {
  id: string
  boardId: string
  name: string // a task's status is the name of the column
  order: number
  isVisible: boolean
  isDone: boolean
}
