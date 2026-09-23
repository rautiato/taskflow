import { Navigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { projectService } from '../features/projects/projectService'
import { kanbanService } from '../features/kanban/kanbanService'

import { ColumnHeaderRow } from '../features/kanban/components/ColumnHeaderRow'
import { AssigneeLane } from '../features/kanban/components/AssigneeLane'
import { groupTasksByAssignee } from '../features/tasks/groupTasksByAssignee'

export function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const user = authService.getSession()
  const project = projectService.listProjects().find((p) => p.id === projectId)

  if (!projectId || !project) {
    return <Navigate to="/projects" replace />
  }

  const { columns, tasks } = kanbanService.getBoardForProject(projectId)
  const assigneeLanes = groupTasksByAssignee(tasks, authService.listUsers())
  const taskCountByColumn = columns.reduce<Record<string, number>>(
    (acc, column) => {
      acc[column.id] = tasks.filter((t) => t.columnId === column.id).length
      return acc
    },
    {},
  )

  return (
    <AppLayout user={user!}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              Projects / {project.name}
            </Typography>
            <Typography sx={{ fontSize: 25, fontWeight: 700 }}>
              {project.name}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {columns.length} columns · {tasks.length} tasks
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ColumnHeaderRow
            columns={columns}
            taskCountByColumn={taskCountByColumn}
          />
          <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
          {assigneeLanes.map((lane, index) => (
            <AssigneeLane
              key={lane.assigneeId ?? 'unassigned'}
              lane={lane}
              columns={columns}
              colorIndex={index}
            />
          ))}
        </Box>
      </Box>
    </AppLayout>
  )
}
