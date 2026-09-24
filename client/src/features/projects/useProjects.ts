import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectService } from './projectService'
import type { ProjectStatus } from '../../models/project'

export function useProjects() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.listProjects(),
  })

  const createProjectMutation = useMutation({
    mutationFn: async (name: string) => projectService.createProject({ name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectService.updateProjectStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })

  return {
    projects: data ?? [],
    isLoading,
    createProject: createProjectMutation.mutateAsync,
    updateProjectStatus: (id: string, status: ProjectStatus) =>
      updateStatusMutation.mutate({ id, status }),
  }
}
