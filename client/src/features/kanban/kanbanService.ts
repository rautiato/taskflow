import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { TaskItem } from '../../models/task'
import {
  SEEDED_BOARDS,
  SEEDED_COLUMNS,
  SEEDED_TASKS,
  KANBAN_SEED_VERSION,
} from '../../mockData/kanban.seed'
import { loadSeededData } from '../../services/localStorageSeed'

const BOARDS_KEY = 'taskflow.boards'
const COLUMNS_KEY = 'taskflow.columns'
const TASKS_KEY = 'taskflow.tasks'

const DEFAULT_COLUMN_NAMES = ['To Do', 'In Progress', 'Done']

function loadBoards(): KanbanBoard[] {
  return loadSeededData(BOARDS_KEY, KANBAN_SEED_VERSION, SEEDED_BOARDS)
}

function loadColumns(): KanbanColumn[] {
  return loadSeededData(COLUMNS_KEY, KANBAN_SEED_VERSION, SEEDED_COLUMNS)
}

function loadTasks(): TaskItem[] {
  return loadSeededData(TASKS_KEY, KANBAN_SEED_VERSION, SEEDED_TASKS)
}

function saveTasks(tasks: TaskItem[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

function defaultBoardFor(projectId: string): {
  board: KanbanBoard
  columns: KanbanColumn[]
} {
  const boardId = `board-${projectId}`
  return {
    board: { id: boardId, projectId, name: 'Board' },
    columns: DEFAULT_COLUMN_NAMES.map((name, index) => ({
      id: `${boardId}-col-${index}`,
      boardId,
      name,
      order: index,
    })),
  }
}

type TaskInput = Pick<
  TaskItem,
  | 'columnId'
  | 'title'
  | 'description'
  | 'priority'
  | 'dueDate'
  | 'assigneeId'
  | 'isFavorite'
>

function getBoardForProject(projectId: string): {
  board: KanbanBoard
  columns: KanbanColumn[]
  tasks: TaskItem[]
} {
  const boards = loadBoards()
  const allColumns = loadColumns()
  const allTasks = loadTasks()

  const board = boards.find((b) => b.projectId === projectId)
  if (!board) {
    const fallback = defaultBoardFor(projectId)
    return { ...fallback, tasks: [] }
  }

  const columns = allColumns
    .filter((c) => c.boardId === board.id)
    .sort((a, b) => a.order - b.order)
  const tasks = allTasks.filter((t) => columns.some((c) => c.id === t.columnId))
  return { board, columns, tasks }
}

function createTask(input: TaskInput): TaskItem {
  const allTasks = loadTasks()
  const now = new Date().toISOString()
  const order = allTasks.filter((t) => t.columnId === input.columnId).length
  const task: TaskItem = {
    id: crypto.randomUUID(),
    ...input,
    order,
    createdAt: now,
    updatedAt: now,
  }
  saveTasks([...allTasks, task])
  return task
}

function updateTask(taskId: string, input: TaskInput): TaskItem {
  const allTasks = loadTasks()
  const now = new Date().toISOString()
  let updated: TaskItem | undefined
  const nextTasks = allTasks.map((t) => {
    if (t.id !== taskId) return t
    updated = { ...t, ...input, updatedAt: now }
    return updated
  })
  if (!updated) {
    throw new Error('Task not found.')
  }
  saveTasks(nextTasks)
  return updated
}

function deleteTask(taskId: string): void {
  const allTasks = loadTasks()
  saveTasks(allTasks.filter((t) => t.id !== taskId))
}

export const kanbanService = {
  getBoardForProject,
  createTask,
  updateTask,
  deleteTask,
}
