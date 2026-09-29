import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../../components/EmptyState'
import { formatProjectDate } from '../../projects/projectService'
import type { YourProject } from '../computeDashboardStats'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
    },
    gap: { xs: 1.5, sm: 2.25 },
  },
  emptyIcon: {
    fontSize: 40,
  },
} satisfies Record<string, SxProps<Theme>>

// Cards for the user's active projects, or an empty state that points to
// browsing projects (some are active) or creating one (none are).
export function YourProjectsSection({
  items,
  hasActiveProjects,
  onNewProject,
}: {
  items: YourProject[]
  hasActiveProjects: boolean
  onNewProject: () => void
}) {
  const navigate = useNavigate()

  return (
    <Box data-testid="your-projects-section">
      <SectionHeading
        title="Your projects"
        subtitle="Team progress on active projects where you have open tasks, most recently updated first"
      />
      {items.length > 0 ? (
        <Box sx={styles.grid}>
          {items.map(({ project, myOpenCount }) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              initials={project.initials}
              paletteColor={project.paletteColor}
              updated={formatProjectDate(project.updatedAt)}
              stats={project}
              myOpenCount={myOpenCount}
              onClick={() => navigate(`/projects/${project.id}/board`)}
            />
          ))}
        </Box>
      ) : hasActiveProjects ? (
        <EmptyState
          icon={<FolderOutlinedIcon sx={styles.emptyIcon} />}
          title="No projects with open tasks for you"
          description="Projects where you have open tasks will show up here."
          action={
            <Button
              variant="outlined"
              onClick={() => navigate('/projects')}
              data-testid="your-projects-section-browse-projects"
            >
              Browse projects
            </Button>
          }
        />
      ) : (
        <EmptyState
          icon={<FolderOutlinedIcon sx={styles.emptyIcon} />}
          title="No active projects yet"
          description="Create a project to start organizing work."
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onNewProject}
              data-testid="your-projects-section-new-project"
            >
              New Project
            </Button>
          }
        />
      )}
    </Box>
  )
}
