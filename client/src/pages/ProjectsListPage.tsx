import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import type { SxProps, Theme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useProjects } from '../features/projects/useProjects'
import { ProjectListRow } from '../features/projects/components/ProjectListRow'
import { NewProjectDialog } from '../features/projects/components/NewProjectDialog'
import type { ProjectStatus } from '../models/project'
import { Navigate, useNavigate } from 'react-router-dom'
import { testIdProps } from '../utils/testIdProps'

const STATUS_FILTERS: Array<'All' | ProjectStatus> = ['All', 'Active', 'Closed']

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // On phones the full-width search takes its own row and the status
  // chips wrap below it.
  toolbar: {
    display: 'flex',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
    alignItems: 'center',
    gap: 1.5,
  },
  searchIcon: {
    fontSize: 18,
  },
  chip: {
    fontWeight: 700,
    fontSize: 12,
    border: 1,
    bgcolor: 'background.paper',
    color: 'text.secondary',
    borderColor: 'divider',
  },
  chipActive: {
    bgcolor: 'primary.light',
    color: 'primary.main',
    borderColor: 'primary.main',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  noResults: {
    textAlign: 'center',
    py: 4,
  },
} satisfies Record<string, SxProps<Theme>>

export function ProjectsListPage() {
  const user = authService.getSession()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All')
  const navigate = useNavigate()
  const { projects, createProject, updateProjectStatus } = useProjects()
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus =
        statusFilter === 'All' || project.status === statusFilter
      const matchesSearch = project.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [projects, search, statusFilter])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user}>
      <Box sx={styles.root} data-testid="projects-page">
        <Box sx={styles.header}>
          <Typography variant="pageTitle" data-testid="projects-page-title">
            Projects
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsNewProjectOpen(true)}
            data-testid="projects-page-new-project"
          >
            New Project
          </Button>
        </Box>

        <Box sx={styles.toolbar}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            size="small"
            fullWidth
            slotProps={{
              htmlInput: testIdProps('projects-page-search'),
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={styles.searchIcon} />
                  </InputAdornment>
                ),
              },
            }}
          />
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status
            return (
              <Chip
                key={status}
                label={status}
                onClick={() => setStatusFilter(status)}
                data-testid={`projects-page-status-${status.toLowerCase()}`}
                sx={[styles.chip, active && styles.chipActive]}
              />
            )
          })}
        </Box>

        <Box sx={styles.list} data-testid="projects-page-list">
          {filteredProjects.map((project) => (
            <ProjectListRow
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}/board`)}
              onToggleStatus={() =>
                updateProjectStatus(
                  project.id,
                  project.status === 'Active' ? 'Closed' : 'Active',
                )
              }
            />
          ))}
          {filteredProjects.length === 0 && (
            <Typography
              color="text.secondary"
              sx={styles.noResults}
              data-testid="projects-page-no-results"
            >
              No projects match your filters.
            </Typography>
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
