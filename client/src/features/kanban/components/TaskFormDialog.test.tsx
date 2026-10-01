import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMockColumn } from '../../../test/createMockColumn'
import { createMockProject } from '../../../test/createMockProject'
import { createMockTask } from '../../../test/createMockTask'
import { TaskFormDialog } from './TaskFormDialog'

const PROJECT_ID = 'website'

const columns = [
  createMockColumn({ id: 'todo', name: 'To Do' }),
  createMockColumn({ id: 'done', name: 'Done', order: 1, isDone: true }),
]

const projects = [createMockProject({ id: PROJECT_ID, name: 'Website' })]

function renderDialog(task?: ReturnType<typeof createMockTask>) {
  const onSave = jest.fn()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <TaskFormDialog
        open
        task={task}
        columns={columns}
        projects={projects}
        users={[]}
        defaultColumnId="todo"
        currentProjectId={PROJECT_ID}
        onClose={jest.fn()}
        onSave={onSave}
      />
    </QueryClientProvider>,
  )
  return { onSave }
}

describe('TaskFormDialog', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows required-field errors and saves nothing when submitted empty', async () => {
    const user = userEvent.setup()
    const { onSave } = renderDialog()

    await user.click(screen.getByTestId('task-form-dialog-submit'))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(screen.getByText('Description is required.')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('saves a new task with the values entered', async () => {
    const user = userEvent.setup()
    const newTask = {
      title: 'Write unit tests',
      description: 'Cover the business rules',
      priority: 'High',
      dueDate: '2026-06-20',
    }
    const { onSave } = renderDialog()

    expect(screen.getByTestId('task-form-dialog-title')).toHaveTextContent(
      'Add Task',
    )
    await user.type(
      screen.getByTestId('task-form-dialog-title-input'),
      newTask.title,
    )
    await user.type(
      screen.getByTestId('task-form-dialog-description'),
      newTask.description,
    )
    await user.click(screen.getByTestId('priority-select'))
    await user.click(
      await screen.findByTestId(
        `priority-select-option-${newTask.priority.toLowerCase()}`,
      ),
    )
    await user.type(
      screen.getByTestId('task-form-dialog-due-date'),
      newTask.dueDate,
    )
    await user.click(screen.getByTestId('task-form-dialog-submit'))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
    expect(onSave).toHaveBeenCalledWith(
      {
        ...newTask,
        // Fields left at their defaults.
        columnId: 'todo',
        assigneeId: null,
        isFavorite: false,
      },
      expect.any(String),
    )
  })

  it("edits an existing task, keeping its id and the fields that weren't changed", async () => {
    const user = userEvent.setup()
    const task = createMockTask({
      id: 'task-1',
      title: 'Old title',
      description: 'Existing description',
      columnId: 'done',
      priority: 'Low',
      isFavorite: true,
    })
    const { onSave } = renderDialog(task)

    expect(screen.getByTestId('task-form-dialog-title')).toHaveTextContent(
      'Edit Task',
    )
    const titleInput = screen.getByTestId('task-form-dialog-title-input')
    expect(titleInput).toHaveValue('Old title')

    await user.clear(titleInput)
    await user.type(titleInput, 'New title')
    await user.click(screen.getByTestId('task-form-dialog-submit'))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1))
    expect(onSave).toHaveBeenCalledWith(
      {
        title: 'New title',
        description: 'Existing description',
        columnId: 'done',
        assigneeId: null,
        priority: 'Low',
        dueDate: null,
        isFavorite: true,
      },
      'task-1',
    )
  })
})
