import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { TaskItem } from '../../models/task'
import {
  SEEDED_BOARDS,
  SEEDED_COLUMNS,
  SEEDED_TASKS,
  KANBAN_SEED_VERSION,
} from '../../mockData/kanban.seed'
import { loadSeededData } from '../../services/localStorageSeed'
import type { ProjectStats } from '../../models/project'
import { matchesDueFilter } from '../tasks/filterMyTasks'

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

function saveColumns(columns: KanbanColumn[]): void {
  localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns))
}

function saveBoards(boards: KanbanBoard[]): void {
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards))
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
      isVisible: true,
      isDone: name === 'Done',
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
  let board = boards.find((b) => b.projectId === projectId)

  if (!board) {
    const created = defaultBoardFor(projectId)
    board = created.board
    saveBoards([...boards, board])
    saveColumns([...loadColumns(), ...created.columns])
  }

  const allColumns = loadColumns()
  const allTasks = loadTasks()
  const columns = allColumns
    .filter((c) => c.boardId === board.id)
    .sort((a, b) => a.order - b.order)
  const tasks = allTasks.filter((t) => columns.some((c) => c.id === t.columnId))
  return { board, columns, tasks }
}

function createTask(
  input: TaskInput,
  createdById: string,
  id?: string,
): TaskItem {
  const allTasks = loadTasks()
  const now = new Date().toISOString()
  const order = allTasks.filter((t) => t.columnId === input.columnId).length
  const task: TaskItem = {
    id: id ?? crypto.randomUUID(),
    ...input,
    createdById,
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

function reorderColumns(
  boardId: string,
  orderedColumnIds: string[],
): KanbanColumn[] {
  const allColumns = loadColumns()
  const indexById = new Map(orderedColumnIds.map((id, index) => [id, index]))
  const nextColumns = allColumns.map((column) =>
    column.boardId === boardId && indexById.has(column.id)
      ? { ...column, order: indexById.get(column.id)! }
      : column,
  )
  saveColumns(nextColumns)
  return nextColumns
    .filter((c) => c.boardId === boardId)
    .sort((a, b) => a.order - b.order)
}

function hideColumn(columnId: string): void {
  const allColumns = loadColumns()
  const allTasks = loadTasks()
  const hasTasks = allTasks.some((t) => t.columnId === columnId)
  if (hasTasks) {
    throw new Error('Cannot hide a column that still has tasks.')
  }
  saveColumns(
    allColumns.map((c) => (c.id === columnId ? { ...c, isVisible: false } : c)),
  )
}

function showColumn(columnId: string): void {
  const allColumns = loadColumns()
  saveColumns(
    allColumns.map((c) => (c.id === columnId ? { ...c, isVisible: true } : c)),
  )
}

function deleteColumn(columnId: string): void {
  const allColumns = loadColumns()
  const allTasks = loadTasks()
  const hasTasks = allTasks.some((t) => t.columnId === columnId)
  if (hasTasks) {
    throw new Error('Cannot delete a column that still has tasks.')
  }
  saveColumns(allColumns.filter((c) => c.id !== columnId))
}

function createColumn(boardId: string, name: string): KanbanColumn {
  const allColumns = loadColumns()
  const boardColumns = allColumns.filter((c) => c.boardId === boardId)
  const order = boardColumns.length
    ? Math.max(...boardColumns.map((c) => c.order)) + 1
    : 0
  const column: KanbanColumn = {
    id: crypto.randomUUID(),
    boardId,
    name,
    order,
    isVisible: true,
    isDone: false,
  }
  saveColumns([...allColumns, column])
  return column
}

function getColumnsForProject(projectId: string): KanbanColumn[] {
  return getBoardForProject(projectId).columns.filter((c) => c.isVisible)
}

function getMyTasksData(assigneeId: string): {
  tasks: TaskItem[]
  columns: KanbanColumn[]
  boards: KanbanBoard[]
} {
  const boards = loadBoards()
  const columns = loadColumns()
  const tasks = loadTasks().filter((t) => t.assigneeId === assigneeId)
  return { tasks, columns, boards }
}

function getProjectStats(
  projectId: string,
): ProjectStats & { lastTaskUpdatedAt: string | null } {
  const board = loadBoards().find((b) => b.projectId === projectId)
  if (!board) {
    return {
      taskCount: 0,
      progress: 0,
      completedCount: 0,
      overdueCount: 0,
      unassignedCount: 0,
      lastTaskUpdatedAt: null,
    }
  }
  const columns = loadColumns().filter((c) => c.boardId === board.id)
  const columnIds = new Set(columns.map((c) => c.id))
  const doneIds = new Set(columns.filter((c) => c.isDone).map((c) => c.id))
  const tasks = loadTasks().filter((t) => columnIds.has(t.columnId))
  const done = tasks.filter((t) => doneIds.has(t.columnId)).length
  const openTasks = tasks.filter((t) => !doneIds.has(t.columnId))
  const lastTaskUpdatedAt = tasks.reduce<string | null>(
    (latest, t) => (!latest || t.updatedAt > latest ? t.updatedAt : latest),
    null,
  )
  return {
    taskCount: tasks.length,
    progress: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
    completedCount: done,
    overdueCount: openTasks.filter((t) =>
      matchesDueFilter(t.dueDate, 'overdue'),
    ).length,
    unassignedCount: openTasks.filter((t) => !t.assigneeId).length,
    lastTaskUpdatedAt,
  }
}

// Read-only lookup backing the /tasks/:taskId short link.
function getProjectIdForTask(taskId: string): string | null {
  const task = loadTasks().find((t) => t.id === taskId)
  const column = task && loadColumns().find((c) => c.id === task.columnId)
  const board = column && loadBoards().find((b) => b.id === column.boardId)
  return board?.projectId ?? null
}

export const kanbanService = {
  getBoardForProject,
  getProjectStats,
  getProjectIdForTask,
  getMyTasksData,
  createTask,
  updateTask,
  deleteTask,
  reorderColumns,
  hideColumn,
  showColumn,
  deleteColumn,
  createColumn,
  getColumnsForProject,
}
