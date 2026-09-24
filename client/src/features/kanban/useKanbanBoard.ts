import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

export type TaskInput = Parameters<typeof kanbanService.createTask>[0]
type BoardData = ReturnType<typeof kanbanService.getBoardForProject>

function kanbanBoardQueryKey(projectId: string) {
  return ['kanbanBoard', projectId] as const
}

export function useKanbanBoard(projectId: string) {
  const queryClient = useQueryClient()
  const queryKey = kanbanBoardQueryKey(projectId)

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => kanbanService.getBoardForProject(projectId),
    enabled: !!projectId,
  })

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey })
  }

  const createTaskMutation = useMutation({
    mutationFn: async ({ input, id }: { input: TaskInput; id?: string }) =>
      kanbanService.createTask(input, id),
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
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === taskId
              ? { ...t, ...input, updatedAt: new Date().toISOString() }
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
    mutationFn: async (columnId: string) => kanbanService.deleteColumn(columnId),
    onSuccess: invalidate,
    onError: (error) => {
      window.alert(
        error instanceof Error ? error.message : 'Could not delete this column.',
      )
    },
  })

  const createColumnMutation = useMutation({
    mutationFn: async ({
      boardId,
      name,
    }: {
      boardId: string
      name: string
    }) => kanbanService.createColumn(boardId, name),
    onSuccess: invalidate,
  })

  return {
    isLoading,
    board: data?.board,
    columns: data?.columns ?? [],
    tasks: data?.tasks ?? [],
    createTask: (input: TaskInput, id?: string) =>
      createTaskMutation.mutate({ input, id }),
    updateTask: (taskId: string, input: TaskInput) =>
      updateTaskMutation.mutate({ taskId, input }),
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
