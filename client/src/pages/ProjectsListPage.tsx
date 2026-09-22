import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { projectService } from '../features/projects/projectService'
import { ProjectListRow } from '../features/projects/components/ProjectListRow'
import type { ProjectStatus } from '../models/project'

const STATUS_FILTERS: Array<'All' | ProjectStatus> = [
  'All',
  'Active',
  'On Hold',
]

export function ProjectsListPage() {
  const user = authService.getSession()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All')

  const projects = projectService.listProjects()

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

  return (
    <AppLayout user={user!}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            Projects
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} disabled>
            New Project
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18 }} />
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
                sx={{
                  fontWeight: 700,
                  fontSize: 12,
                  border: 1,
                  ...(active
                    ? {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        borderColor: 'primary.main',
                      }
                    : {
                        bgcolor: 'background.paper',
                        color: 'text.secondary',
                        borderColor: 'divider',
                      }),
                }}
              />
            )
          })}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filteredProjects.map((project) => (
            <ProjectListRow key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ textAlign: 'center', py: 4 }}
            >
              No projects match your filters.
            </Typography>
          )}
        </Box>
      </Box>
    </AppLayout>
  )
}
