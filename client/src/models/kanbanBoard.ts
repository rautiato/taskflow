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
  // Marks the board's Done column: tasks in it count as completed
  // ("Completed" chip, progress, dashboard). Set by the app, never by
  // users — the Done column can't be hidden or deleted.
  isDone: boolean
}
