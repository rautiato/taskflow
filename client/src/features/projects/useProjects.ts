import { useQuery } from '@tanstack/react-query'
import { projectService } from './projectService'

export function useProjects() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.listProjects(),
  })

  return { projects: data ?? [], isLoading }
}
