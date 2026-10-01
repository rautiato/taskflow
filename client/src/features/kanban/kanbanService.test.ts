import { kanbanService } from './kanbanService'
import { taskToInput, type TaskInput } from './useKanbanBoard'

// A project that isn't in the seed data, so it gets a fresh default board:
// To Do, In Progress, Done.
const PROJECT_ID = 'test-project'

function getBoard() {
  return kanbanService.getBoardForProject(PROJECT_ID)
}

function columnNamed(name: string) {
  const column = getBoard().columns.find((c) => c.name === name)
  if (!column) throw new Error(`No column named ${name}`)
  return column
}

function createTaskInColumn(
  columnId: string,
  overrides: Partial<TaskInput> = {},
) {
  return kanbanService.createTask(
    {
      columnId,
      title: 'Task',
      description: 'Description',
      priority: 'Medium',
      dueDate: null,
      assigneeId: null,
      isFavorite: false,
      ...overrides,
    },
    'seed-1',
  )
}

describe('kanbanService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates a new project board with To Do, In Progress and Done', () => {
    const { columns } = getBoard()

    expect(columns.map((c) => c.name)).toEqual(['To Do', 'In Progress', 'Done'])
    expect(columns.filter((c) => c.isDone).map((c) => c.name)).toEqual(['Done'])
  })

  describe('Done column', () => {
    it('cannot be deleted', () => {
      const done = columnNamed('Done')

      expect(() => kanbanService.deleteColumn(done.id)).toThrow(
        'The Done column cannot be deleted.',
      )
      expect(getBoard().columns).toContainEqual(done)
    })

    it('cannot be hidden', () => {
      const done = columnNamed('Done')

      expect(() => kanbanService.hideColumn(done.id)).toThrow(
        'The Done column cannot be hidden.',
      )
      expect(columnNamed('Done').isVisible).toBe(true)
    })
  })

  describe('other columns', () => {
    it('can be deleted when empty', () => {
      const inProgress = columnNamed('In Progress')

      kanbanService.deleteColumn(inProgress.id)

      expect(getBoard().columns.map((c) => c.name)).toEqual(['To Do', 'Done'])
    })

    it('cannot be deleted or hidden while they still have tasks', () => {
      const todo = columnNamed('To Do')
      createTaskInColumn(todo.id)

      expect(() => kanbanService.deleteColumn(todo.id)).toThrow(
        'Cannot delete a column that still has tasks.',
      )
      expect(() => kanbanService.hideColumn(todo.id)).toThrow(
        'Cannot hide a column that still has tasks.',
      )
    })
  })

  describe('createColumn', () => {
    it('adds the column at the end of the board', () => {
      const { board } = getBoard()

      kanbanService.createColumn(board.id, 'Review')

      expect(getBoard().columns.map((c) => c.name)).toEqual([
        'To Do',
        'In Progress',
        'Done',
        'Review',
      ])
    })

    it('rejects a name already used on the board, ignoring case', () => {
      const { board } = getBoard()

      expect(() => kanbanService.createColumn(board.id, 'to do')).toThrow(
        'A column with this name already exists.',
      )
      expect(getBoard().columns).toHaveLength(3)
    })
  })

  describe('completion date', () => {
    it('is empty for a task created in an open column', () => {
      const task = createTaskInColumn(columnNamed('To Do').id)

      expect(task.completedAt).toBeNull()
    })

    it('is set when a task is created in Done', () => {
      const task = createTaskInColumn(columnNamed('Done').id)

      expect(task.completedAt).not.toBeNull()
    })

    it('is set when a task moves to Done and cleared when it moves back', () => {
      const task = createTaskInColumn(columnNamed('To Do').id)

      const finished = kanbanService.updateTask(task.id, {
        ...taskToInput(task),
        columnId: columnNamed('Done').id,
      })
      expect(finished.completedAt).not.toBeNull()

      const reopened = kanbanService.updateTask(task.id, {
        ...taskToInput(finished),
        columnId: columnNamed('To Do').id,
      })
      expect(reopened.completedAt).toBeNull()
    })
  })

  describe('due date', () => {
    it('is saved as the calendar date', () => {
      const task = createTaskInColumn(columnNamed('To Do').id, {
        dueDate: '2026-06-15',
      })

      expect(task.dueDate).toBe('2026-06-15')
    })

    it('is converted to YYYY-MM-DD when saved in the old timestamp format', () => {
      const task = createTaskInColumn(columnNamed('To Do').id)
      const stored = JSON.parse(localStorage.getItem('taskflow.tasks')!)
      localStorage.setItem(
        'taskflow.tasks',
        JSON.stringify(
          stored.map((t: { id: string }) =>
            t.id === task.id
              ? { ...t, dueDate: '2026-06-15T00:00:00.000Z' }
              : t,
          ),
        ),
      )

      const { tasks } = kanbanService.getTaskListData()

      expect(tasks.find((t) => t.id === task.id)?.dueDate).toBe('2026-06-15')
    })
  })
})
