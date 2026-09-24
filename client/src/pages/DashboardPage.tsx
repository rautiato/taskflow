import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Navigate, useNavigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { formatProjectDate } from '../features/projects/projectService'
import { useProjects } from '../features/projects/useProjects'
import { StatCard } from '../features/dashboard/components/StatCard'
import { ProjectCard } from '../features/dashboard/components/ProjectCard'

const STAT_CARDS = [
  {
    label: 'My Tasks',
    value: 12,
    note: '+2 from last week',
    color: 'primary.main' as const,
  },
  {
    label: 'Due Soon',
    value: 4,
    note: '1 overdue',
    color: 'warning.main' as const,
  },
  {
    label: 'Completed',
    value: 27,
    note: '+5 this week',
    color: 'success.main' as const,
  },
]

export function DashboardPage() {
  const user = authService.getSession()
  const navigate = useNavigate()
  const { projects } = useProjects()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const firstName = user.name.split(' ')[0]

  // "My Projects" is a recency shortcut, not the full roster (that's what
  // Projects List is for) — active projects only, most recently updated
  // first, same convention as Asana/Trello's project shortcuts.
  const topProjects = projects
    .filter((project) => project.status === 'Active')
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3)

  return (
    <AppLayout user={user}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
          Welcome back, {firstName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2.25 }}>
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              note={card.note}
              noteColor={card.color}
            />
          ))}
        </Box>

        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1.75 }}>
            My Projects
          </Typography>
          <Box sx={{ display: 'flex', gap: 2.25 }}>
            {topProjects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                initials={project.initials}
                tasks={project.taskCount}
                updated={formatProjectDate(project.updatedAt)}
                progress={project.progress}
                paletteColor={project.paletteColor}
                onClick={() => navigate(`/projects/${project.id}/board`)}
              />
            ))}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Stat tiles above show placeholder numbers — computing them for real
          means summing tasks assigned to you across every project, not just one
          board, which isn't wired up yet.
        </Typography>
      </Box>
    </AppLayout>
  )
}
