import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useProjects } from '../features/projects/useProjects'
import { NewProjectDialog } from '../features/projects/components/NewProjectDialog'
import { myTasksHref } from '../features/tasks/taskListFilters'
import {
  NextTasksList,
  type NextTaskItem,
} from '../features/dashboard/components/NextTasksList'
import { YourTasksSection } from '../features/dashboard/components/YourTasksSection'
import { YourProjectsSection } from '../features/dashboard/components/YourProjectsSection'
import { useMyTasks } from '../features/kanban/useTaskLists'
import {
  computeDashboardStats,
  selectUpNext,
  selectYourProjects,
} from '../features/dashboard/computeDashboardStats'
import { EmptyState } from '../components/EmptyState'
import type { KanbanColumn } from '../models/kanbanBoard'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  emptyIcon: {
    fontSize: 40,
  },
} satisfies Record<string, SxProps<Theme>>

function greetingFor(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const user = authService.getSession()
  const navigate = useNavigate()
  const { projects, createProject } = useProjects()
  const { tasks, columns, boards } = useMyTasks(user?.id ?? '')
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const now = new Date()
  // Tiles link to My Tasks by status *name*, so "open" / "done" are resolved
  // to names here from each column's isDone flag — works whatever a project
  // calls its Done column.
  // Unique names across projects: every board's "To Do" is one status here.
  // Hidden columns are skipped — they never hold tasks, so they'd only
  // clutter the links' Status filter.
  const uniqueNames = (cols: KanbanColumn[]) => [
    ...new Set(cols.filter((c) => c.isVisible).map((c) => c.name)),
  ]
  const openStatusNames = uniqueNames(columns.filter((c) => !c.isDone))
  const doneStatusNames = uniqueNames(columns.filter((c) => c.isDone))

  const projectByBoardId = new Map(
    boards.map((b) => [b.id, projects.find((p) => p.id === b.projectId)]),
  )
  // The dashboard is about current work: tasks in closed projects stay on
  // My Tasks (under "All") but don't count here.
  const activeColumnIds = new Set(
    columns
      .filter((c) => projectByBoardId.get(c.boardId)?.status === 'Active')
      .map((c) => c.id),
  )
  const activeTasks = tasks.filter((t) => activeColumnIds.has(t.columnId))

  const nextTaskItems: NextTaskItem[] = selectUpNext(
    activeTasks,
    columns,
  ).flatMap((task) => {
    const column = columns.find((c) => c.id === task.columnId)
    const project = column && projectByBoardId.get(column.boardId)
    return project
      ? [
          {
            task,
            projectName: project.name,
            href: `/projects/${project.id}/board?task=${task.id}`,
          },
        ]
      : []
  })

  const yourProjects = selectYourProjects(tasks, columns, boards, projects)
  const hasActiveProjects = projects.some((p) => p.status === 'Active')

  return (
    <AppLayout user={user}>
      <Box sx={styles.root} data-testid="dashboard-page">
        <Box>
          <Typography variant="pageTitle" data-testid="dashboard-page-greeting">
            {greetingFor(now)}, {user.name.split(' ')[0]}
          </Typography>
          <Typography variant="pageSubtitle" data-testid="dashboard-page-date">
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        {hasActiveProjects && (
          <>
            <YourTasksSection
              stats={computeDashboardStats(activeTasks, columns, now)}
              openStatusNames={openStatusNames}
              doneStatusNames={doneStatusNames}
            />

            <NextTasksList
              items={nextTaskItems}
              viewAllHref={myTasksHref(
                { projectStatus: 'Active', statusNames: openStatusNames },
                { key: 'dueDate', dir: 'asc' },
              )}
              empty={
                <EmptyState
                  icon={<TaskAltIcon sx={styles.emptyIcon} />}
                  title="You're all caught up"
                  description="Tasks assigned to you will show up here."
                  action={
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/projects')}
                      data-testid="dashboard-page-browse-projects"
                    >
                      Browse projects
                    </Button>
                  }
                />
              }
            />
          </>
        )}

        <YourProjectsSection
          items={yourProjects}
          hasActiveProjects={hasActiveProjects}
          onNewProject={() => setIsNewProjectOpen(true)}
        />
      </Box>

      <NewProjectDialog
        open={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreate={async (name) => {
          const project = await createProject(name)
          setIsNewProjectOpen(false)
          navigate(`/projects/${project.id}/board`)
        }}
      />
    </AppLayout>
  )
}
