import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { formatProjectDate } from '../features/projects/projectService'
import { useProjects } from '../features/projects/useProjects'
import { NewProjectDialog } from '../features/projects/components/NewProjectDialog'
import { StatCard } from '../features/dashboard/components/StatCard'
import { PriorityBreakdown } from '../features/dashboard/components/PriorityBreakdown'
import { myTasksHref } from '../features/tasks/filterMyTasks'
import { ProjectCard } from '../features/dashboard/components/ProjectCard'
import { SectionHeading } from '../features/dashboard/components/SectionHeading'
import {
  NextTasksList,
  type NextTaskItem,
} from '../features/dashboard/components/NextTasksList'
import { useMyTasks } from '../features/kanban/useMyTasks'
import {
  computeDashboardStats,
  selectUpNext,
} from '../features/dashboard/computeDashboardStats'
import { EmptyState } from '../components/EmptyState'
import { getDoneColumnIds } from '../features/tasks/taskDisplay'

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

  const firstName = user.name.split(' ')[0]
  const now = new Date()
  const stats = computeDashboardStats(tasks, columns, now)
  // Tiles link to My Tasks by status *name*, so "open" / "done" are resolved
  // to names here from each column's isDone flag — works whatever a project
  // calls its Done column.
  const statusNamesWhere = (isDone: boolean) => [
    ...new Set(columns.filter((c) => c.isDone === isDone).map((c) => c.name)),
  ]
  const openStatusNames = statusNamesWhere(false)
  const openHref = myTasksHref({ statusNames: openStatusNames })

  const projectByBoardId = new Map(
    boards.map((b) => [b.id, projects.find((p) => p.id === b.projectId)]),
  )
  const nextTaskItems: NextTaskItem[] = selectUpNext(tasks, columns).flatMap(
    (task) => {
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
    },
  )

  // "Your projects" is personal, like the rest of the dashboard: active
  // projects where the user has at least one open task, most recently
  // updated first. (Prod apps show "recently viewed" here — the natural
  // upgrade once a backend can record views; see PLAN.md §3.)
  const doneColumnIds = getDoneColumnIds(columns)
  const myOpenCountByProjectId = new Map<string, number>()
  for (const task of tasks) {
    if (doneColumnIds.has(task.columnId)) continue
    const column = columns.find((c) => c.id === task.columnId)
    const project = column && projectByBoardId.get(column.boardId)
    if (project) {
      myOpenCountByProjectId.set(
        project.id,
        (myOpenCountByProjectId.get(project.id) ?? 0) + 1,
      )
    }
  }
  const hasActiveProjects = projects.some((p) => p.status === 'Active')
  const yourProjects = projects
    .filter(
      (project) =>
        project.status === 'Active' && myOpenCountByProjectId.has(project.id),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3)

  return (
    <AppLayout user={user}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            {greetingFor(now)}, {firstName}
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        <Box>
          <SectionHeading
            title="Your tasks"
            subtitle="Assigned to you across all projects"
          />
          <Box sx={{ display: 'flex', gap: 2.25 }}>
            <StatCard
              label="Open tasks"
              value={stats.open}
              accentColor={stats.open ? 'primary.main' : undefined}
              to={openHref}
            >
              <PriorityBreakdown
                counts={stats.openByPriority}
                hrefFor={(priority) =>
                  myTasksHref({
                    statusNames: openStatusNames,
                    priorities: [priority],
                  })
                }
              />
            </StatCard>
            <StatCard
              label="Overdue"
              value={stats.overdue}
              accentColor={stats.overdue ? 'error.main' : undefined}
              note="Past their due date"
              to={myTasksHref({
                statusNames: openStatusNames,
                due: ['overdue'],
              })}
            />
            <StatCard
              label="Due this week"
              value={stats.dueThisWeek}
              accentColor={stats.dueThisWeek ? 'warning.main' : undefined}
              note="Due in the next 7 days"
              to={myTasksHref({ statusNames: openStatusNames, due: ['next7'] })}
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              accentColor={stats.completed ? 'success.main' : undefined}
              note={`of ${stats.assigned} assigned`}
              to={myTasksHref({ statusNames: statusNamesWhere(true) })}
            />
          </Box>
        </Box>

        <NextTasksList
          items={nextTaskItems}
          viewAllHref={myTasksHref(
            { statusNames: openStatusNames },
            { key: 'dueDate', dir: 'asc' },
          )}
          empty={
            <EmptyState
              icon={<TaskAltIcon sx={{ fontSize: 40 }} />}
              title="You're all caught up"
              description="Tasks assigned to you will show up here."
              action={
                <Button
                  variant="outlined"
                  onClick={() => navigate('/projects')}
                >
                  Browse projects
                </Button>
              }
            />
          }
        />

        <Box>
          <SectionHeading
            title="Your projects"
            subtitle="Team progress on active projects where you have open tasks, most recently updated first"
          />
          {yourProjects.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 2.25 }}>
              {yourProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  initials={project.initials}
                  paletteColor={project.paletteColor}
                  updated={formatProjectDate(project.updatedAt)}
                  stats={project}
                  myOpenCount={myOpenCountByProjectId.get(project.id) ?? 0}
                  onClick={() => navigate(`/projects/${project.id}/board`)}
                />
              ))}
            </Box>
          ) : hasActiveProjects ? (
            <EmptyState
              icon={<FolderOutlinedIcon sx={{ fontSize: 40 }} />}
              title="No projects with open tasks for you"
              description="Projects where you have open tasks will show up here."
              action={
                <Button
                  variant="outlined"
                  onClick={() => navigate('/projects')}
                >
                  Browse projects
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<FolderOutlinedIcon sx={{ fontSize: 40 }} />}
              title="No active projects yet"
              description="Create a project to start organizing work."
              action={
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsNewProjectOpen(true)}
                >
                  New Project
                </Button>
              }
            />
          )}
        </Box>
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
