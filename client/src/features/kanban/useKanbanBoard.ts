import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'
import { TASK_LISTS_KEY } from './useTaskLists'
import { nextCompletedAt } from '../tasks/taskCompletion'
import type { TaskItem } from '../../models/task'

export type TaskInput = Parameters<typeof kanbanService.createTask>[0]
type BoardData = ReturnType<typeof kanbanService.getBoardForProject>

export function taskToInput(task: TaskItem): TaskInput {
  return {
    columnId: task.columnId,
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId,
    isFavorite: task.isFavorite,
  }
}

function kanbanBoardQueryKey(projectId: string) {
  return ['kanbanBoard', projectId] as const
}

/**
 * Loads a project's board (columns and tasks) and exposes its mutations.
 * Task and column-order updates are applied optimistically and rolled back
 * on error. Every mutation invalidates all boards, the cross-project task
 * lists and the projects list, since a task change can affect each of them.
 */
export function useKanbanBoard(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = kanbanBoardQueryKey(projectId)

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => kanbanService.getBoardForProject(projectId),
    enabled: !!projectId,
  })

  function invalidate() {
    // Prefix match, not the exact key — a task move can change a
    // different project's board too, so every cached board is marked
    // stale, not just the one currently open. Also invalidates the
    // cross-project task lists (My Tasks, All Tasks, the dashboard), since a
    // task mutation here can affect what those show too, and the projects
    // list, whose task counts and progress are derived from tasks.
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['kanbanBoard'] }),
      queryClient.invalidateQueries({ queryKey: [TASK_LISTS_KEY] }),
      queryClient.invalidateQueries({ queryKey: ['projects'] }),
    ])
  }

  const createTaskMutation = useMutation({
    mutationFn: async ({
      input,
      createdById,
      id,
    }: {
      input: TaskInput
      createdById: string
      id?: string
    }) => kanbanService.createTask(input, createdById, id),
    onSuccess: invalidate,
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      input,
    }: {
      taskId: string
      input: TaskInput
    }) => kanbanService.updateTask(taskId, input),
    onMutate: async ({ taskId, input }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<BoardData>(queryKey)
      queryClient.setQueryData<BoardData>(queryKey, (old) => {
        if (!old) return old
        const now = new Date().toISOString()
        // Same completion rule as the service, so a card dropped into Done
        // shows its "Completed" date straight away.
        const isDone = old.columns.some(
          (c) => c.id === input.columnId && c.isDone,
        )
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ...input,
                  updatedAt: now,
                  completedAt: nextCompletedAt(t.completedAt, isDone, now),
                }
              : t,
          ),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: invalidate,
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => kanbanService.deleteTask(taskId),
    onSuccess: invalidate,
  })

  const reorderColumnsMutation = useMutation({
    mutationFn: async ({
      boardId,
      orderedColumnIds,
    }: {
      boardId: string
      orderedColumnIds: string[]
    }) => kanbanService.reorderColumns(boardId, orderedColumnIds),
    onMutate: async ({ orderedColumnIds }) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<BoardData>(queryKey)
      queryClient.setQueryData<BoardData>(queryKey, (old) => {
        if (!old) return old
        const indexById = new Map(
          orderedColumnIds.map((id, index) => [id, index]),
        )
        return {
          ...old,
          columns: [...old.columns]
            .map((c) =>
              indexById.has(c.id) ? { ...c, order: indexById.get(c.id)! } : c,
            )
            .sort((a, b) => a.order - b.order),
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
    onSettled: invalidate,
  })

  const hideColumnMutation = useMutation({
    mutationFn: async (columnId: string) => kanbanService.hideColumn(columnId),
    onSuccess: invalidate,
  })

  const showColumnMutation = useMutation({
    mutationFn: async (columnId: string) => kanbanService.showColumn(columnId),
    onSuccess: invalidate,
  })

  const deleteColumnMutation = useMutation({
    mutationFn: async (columnId: string) =>
      kanbanService.deleteColumn(columnId),
    onSuccess: invalidate,
  })

  const createColumnMutation = useMutation({
    mutationFn: async ({ boardId, name }: { boardId: string; name: string }) =>
      kanbanService.createColumn(boardId, name),
    onSuccess: invalidate,
  })

  return {
    isLoading,
    board: data?.board,
    columns: data?.columns ?? [],
    tasks: data?.tasks ?? [],
    createTask: (input: TaskInput, createdById: string, id?: string) =>
      createTaskMutation.mutate({ input, createdById, id }),
    updateTask: (taskId: string, input: TaskInput) =>
      updateTaskMutation.mutate({ taskId, input }),
    toggleFavorite: (task: TaskItem) =>
      updateTaskMutation.mutate({
        taskId: task.id,
        input: { ...taskToInput(task), isFavorite: !task.isFavorite },
      }),
    deleteTask: deleteTaskMutation.mutate,
    reorderColumns: (boardId: string, orderedColumnIds: string[]) =>
      reorderColumnsMutation.mutate({ boardId, orderedColumnIds }),
    hideColumn: hideColumnMutation.mutate,
    showColumn: showColumnMutation.mutate,
    deleteColumn: deleteColumnMutation.mutate,
    createColumn: (boardId: string, name: string) =>
      createColumnMutation.mutate({ boardId, name }),
  }
}
