import { useQuery } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

// Shared prefix, so one invalidation refreshes both lists.
export const TASK_LISTS_KEY = 'taskLists'

export function useMyTasks(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: [TASK_LISTS_KEY, 'mine', userId],
    queryFn: () => kanbanService.getTaskListData(userId),
    enabled: !!userId,
  })

  return {
    isLoading,
    tasks: data?.tasks ?? [],
    columns: data?.columns ?? [],
    boards: data?.boards ?? [],
  }
}

export function useAllTasks(enabled = true) {
  const { data, isLoading } = useQuery({
    queryKey: [TASK_LISTS_KEY, 'all'],
    queryFn: () => kanbanService.getTaskListData(),
    enabled,
  })

  return {
    isLoading,
    tasks: data?.tasks ?? [],
    columns: data?.columns ?? [],
    boards: data?.boards ?? [],
  }
}
