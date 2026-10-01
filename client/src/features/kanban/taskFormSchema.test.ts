import { createMockTask } from '../../test/createMockTask'
import {
  UNASSIGNED,
  taskFormSchema,
  toFormValues,
  type TaskFormValues,
} from './taskFormSchema'

const validValues: TaskFormValues = {
  title: 'Write tests',
  description: 'Cover the business rules',
  projectId: 'website',
  columnId: 'todo',
  assigneeId: UNASSIGNED,
  priority: 'Medium',
  dueDate: '',
  isFavorite: false,
}

function errorsFor(values: TaskFormValues) {
  const result = taskFormSchema.safeParse(values)
  return result.success
    ? {}
    : Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0], issue.message]),
      )
}

describe('taskFormSchema', () => {
  it('accepts a complete task', () => {
    expect(taskFormSchema.safeParse(validValues).success).toBe(true)
  })

  it('accepts a task with no assignee and no due date', () => {
    expect(errorsFor(validValues)).toEqual({})
  })

  it('requires a title, description, project and status', () => {
    expect(
      errorsFor({
        ...validValues,
        title: '',
        description: '',
        projectId: '',
        columnId: '',
      }),
    ).toEqual({
      title: 'Title is required.',
      description: 'Description is required.',
      projectId: 'Project is required.',
      columnId: 'Status is required.',
    })
  })
})

describe('toFormValues', () => {
  it('fills in defaults for a new task', () => {
    expect(toFormValues(undefined, 'todo', 'website')).toEqual({
      title: '',
      description: '',
      projectId: 'website',
      columnId: 'todo',
      assigneeId: UNASSIGNED,
      priority: 'Medium',
      dueDate: '',
      isFavorite: false,
    })
  })

  it("loads an existing task's values", () => {
    const task = createMockTask({
      title: 'Fix login bug',
      description: 'Steps in the ticket',
      columnId: 'in-progress',
      assigneeId: 'seed-1',
      priority: 'High',
      dueDate: '2026-06-20',
      isFavorite: true,
    })

    expect(toFormValues(task, 'todo', 'website')).toEqual({
      title: 'Fix login bug',
      description: 'Steps in the ticket',
      projectId: 'website',
      columnId: 'in-progress',
      assigneeId: 'seed-1',
      priority: 'High',
      dueDate: '2026-06-20',
      isFavorite: true,
    })
  })

  it('shows an unassigned task as Unassigned', () => {
    const task = createMockTask({ assigneeId: null })

    expect(toFormValues(task, 'todo', 'website').assigneeId).toBe(UNASSIGNED)
  })
})
