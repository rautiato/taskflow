import { Navigate, useParams } from 'react-router-dom'
import { useTaskLocation } from '../features/kanban/useTaskLocation'

// /tasks/:taskId — a short, shareable task link that survives the task
// moving between projects. Resolves the task's project and opens it on
// that board; an unknown or deleted task falls back to My Tasks.
export function TaskRedirectPage() {
  const { taskId = '' } = useParams<{ taskId: string }>()
  const { projectId, isLoading } = useTaskLocation(taskId)

  if (isLoading) return null

  return projectId ? (
    <Navigate to={`/projects/${projectId}/board?task=${taskId}`} replace />
  ) : (
    <Navigate to="/my-tasks" replace />
  )
}
