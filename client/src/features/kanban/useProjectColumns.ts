import { useQuery } from '@tanstack/react-query'
import { kanbanService } from './kanbanService'

export function useProjectColumns(projectId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['projectColumns', projectId],
    queryFn: () => kanbanService.getColumnsForProject(projectId),
    enabled: !!projectId,
  })

  return { columns: data ?? [], isLoading }
}
