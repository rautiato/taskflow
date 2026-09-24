import { useQuery } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

export function useMyTasks(userId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['myTasks', userId],
    queryFn: () => kanbanService.getMyTasksData(userId),
    enabled: !!userId,
  })

  return {
    isLoading,
    tasks: data?.tasks ?? [],
    columns: data?.columns ?? [],
    boards: data?.boards ?? [],
  }
}
