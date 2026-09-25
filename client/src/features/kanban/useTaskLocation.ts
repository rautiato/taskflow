import { useQuery } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

export function useTaskLocation(taskId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['taskLocation', taskId],
    queryFn: () => kanbanService.getProjectIdForTask(taskId),
    enabled: !!taskId,
  })

  return {
    isLoading,
    projectId: data ?? null,
  }
}
