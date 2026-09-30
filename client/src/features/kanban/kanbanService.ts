import type { KanbanBoard, KanbanColumn } from '../../models/kanbanBoard'
import type { TaskItem } from '../../models/task'
import {
  SEEDED_BOARDS,
  SEEDED_COLUMNS,
  SEEDED_TASKS,
  KANBAN_SEED_VERSION,
} from '../../mockData/kanban.seed'
import { loadSeededData } from '../../services/localStorageSeed'
import { writeJson } from '../../services/storage'
import type { ProjectStats } from '../../models/project'
import { matchesDueFilter } from '../tasks/taskListFilters'
import { getDoneColumnIds } from '../tasks/taskDisplay'
import { nextCompletedAt } from '../tasks/taskCompletion'
import { attachmentService } from './attachmentService'
import { commentService } from './commentService'

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

// NO-BACKEND: tasks saved before completedAt existed don't have it.
type StoredTask = Omit<TaskItem, 'completedAt'> & {
  completedAt?: string | null
}

function loadTasks(): TaskItem[] {
  const tasks: StoredTask[] = loadSeededData(
    TASKS_KEY,
    KANBAN_SEED_VERSION,
    SEEDED_TASKS,
  )
  // NO-BACKEND: fill in completedAt once for tasks saved without it, using
  // updatedAt as the best available guess; a backend would do this in a
  // one-off data migration instead.
  if (tasks.every((t) => t.completedAt !== undefined)) {
    return tasks as TaskItem[]
  }
  const doneColumnIds = getDoneColumnIds(loadColumns())
  const migrated: TaskItem[] = tasks.map((t) => ({
    ...t,
    completedAt:
      t.completedAt !== undefined
        ? t.completedAt
        : doneColumnIds.has(t.columnId)
          ? t.updatedAt
          : null,
  }))
  saveTasks(migrated)
  return migrated
}

function isDoneColumnId(columnId: string): boolean {
  return loadColumns().some((c) => c.id === columnId && c.isDone)
}

function saveTasks(tasks: TaskItem[]): void {
  writeJson(TASKS_KEY, tasks)
}

function saveColumns(columns: KanbanColumn[]): void {
  writeJson(COLUMNS_KEY, columns)
}

function saveBoards(boards: KanbanBoard[]): void {
  writeJson(BOARDS_KEY, boards)
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
    completedAt: nextCompletedAt(null, isDoneColumnId(input.columnId), now),
  }
  saveTasks([...allTasks, task])
  return task
}

function updateTask(taskId: string, input: TaskInput): TaskItem {
  const allTasks = loadTasks()
  const now = new Date().toISOString()
  const isDone = isDoneColumnId(input.columnId)
  let updated: TaskItem | undefined
  const nextTasks = allTasks.map((t) => {
    if (t.id !== taskId) return t
    updated = {
      ...t,
      ...input,
      updatedAt: now,
      completedAt: nextCompletedAt(t.completedAt, isDone, now),
    }
    return updated
  })
  if (!updated) {
    throw new Error('Task not found.')
  }
  saveTasks(nextTasks)
  return updated
}

// A task owns its comments and attachments, so they go with it, the same
// way a database's cascade delete would remove them.
function deleteTask(taskId: string): void {
  commentService.deleteByTask(taskId)
  attachmentService.deleteByTask(taskId)
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
  if (allColumns.find((c) => c.id === columnId)?.isDone) {
    throw new Error('The Done column cannot be hidden.')
  }
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
  if (allColumns.find((c) => c.id === columnId)?.isDone) {
    throw new Error('The Done column cannot be deleted.')
  }
  const hasTasks = allTasks.some((t) => t.columnId === columnId)
  if (hasTasks) {
    throw new Error('Cannot delete a column that still has tasks.')
  }
  saveColumns(allColumns.filter((c) => c.id !== columnId))
}

function createColumn(boardId: string, name: string): KanbanColumn {
  const allColumns = loadColumns()
  const boardColumns = allColumns.filter((c) => c.boardId === boardId)
  // Same rule as the Manage Columns menu: names are unique per board,
  // ignoring case (hidden columns included).
  if (boardColumns.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('A column with this name already exists.')
  }
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

// Tasks across every project — all of them, or only one user's.
function getTaskListData(assigneeId?: string): {
  tasks: TaskItem[]
  columns: KanbanColumn[]
  boards: KanbanBoard[]
} {
  const boards = loadBoards()
  const columns = loadColumns()
  const allTasks = loadTasks()
  const tasks = assigneeId
    ? allTasks.filter((t) => t.assigneeId === assigneeId)
    : allTasks
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
  getTaskListData,
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
