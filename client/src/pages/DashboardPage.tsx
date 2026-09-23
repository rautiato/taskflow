import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import {
  projectService,
  formatProjectDate,
} from '../features/projects/projectService'
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
  const firstName = user?.name.split(' ')[0] ?? ''
  const projects = projectService.listProjects().slice(0, 3)
  const navigate = useNavigate()

  return (
    <AppLayout user={user!}>
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
            {projects.map((project) => (
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
          Placeholder data — this will be wired to real projects and tasks once
          those features land.
        </Typography>
      </Box>
    </AppLayout>
  )
}
