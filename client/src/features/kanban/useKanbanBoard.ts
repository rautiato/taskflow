import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

export type TaskInput = Parameters<typeof kanbanService.createTask>[0]

function kanbanBoardQueryKey(projectId: string) {
  return ['kanbanBoard', projectId] as const
}

export function useKanbanBoard(projectId: string) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: kanbanBoardQueryKey(projectId),
    queryFn: () => kanbanService.getBoardForProject(projectId),
    enabled: !!projectId,
  })

  function invalidate() {
    return queryClient.invalidateQueries({
      queryKey: kanbanBoardQueryKey(projectId),
    })
  }

  const createTaskMutation = useMutation({
    mutationFn: async (input: TaskInput) => kanbanService.createTask(input),
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
    onSuccess: invalidate,
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => kanbanService.deleteTask(taskId),
    onSuccess: invalidate,
  })

  return {
    isLoading,
    columns: data?.columns ?? [],
    tasks: data?.tasks ?? [],
    createTask: createTaskMutation.mutate,
    updateTask: (taskId: string, input: TaskInput) =>
      updateTaskMutation.mutate({ taskId, input }),
    deleteTask: deleteTaskMutation.mutate,
  }
}
