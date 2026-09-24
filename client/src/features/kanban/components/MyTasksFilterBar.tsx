import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import type { TaskPriority } from '../../../models/task'
import type { Project } from '../../../models/project'
import type { UserDto } from '../../../models/user'
import {
  ALL,
  UNKNOWN_CREATOR,
  type MyTasksFilters,
} from '../../tasks/filterMyTasks'

const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low']

export function MyTasksFilterBar({
  filters,
  onChange,
  projects,
  statusOptions,
  creators,
}: {
  filters: MyTasksFilters
  onChange: (filters: MyTasksFilters) => void
  projects: Project[]
  statusOptions: string[]
  creators: UserDto[]
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        sx={{ width: 300 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        size="small"
        select
        label="Project"
        value={filters.projectId}
        onChange={(event) =>
          // Changing project invalidates any status already picked from the
          // previous project's (or the cross-project) status list.
          onChange({ ...filters, projectId: event.target.value, statusName: ALL })
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value={ALL}>All Projects</MenuItem>
        {projects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            {project.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        select
        label="Status"
        value={filters.statusName}
        onChange={(event) =>
          onChange({ ...filters, statusName: event.target.value })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value={ALL}>All</MenuItem>
        {statusOptions.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        select
        label="Priority"
        value={filters.priority}
        onChange={(event) =>
          onChange({
            ...filters,
            priority: event.target.value as MyTasksFilters['priority'],
          })
        }
        sx={{ minWidth: 140 }}
      >
        <MenuItem value={ALL}>All</MenuItem>
        {PRIORITIES.map((priority) => (
          <MenuItem key={priority} value={priority}>
            {priority}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        select
        label="Created By"
        value={filters.createdById}
        onChange={(event) =>
          onChange({
            ...filters,
            createdById: event.target.value as MyTasksFilters['createdById'],
          })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value={ALL}>All</MenuItem>
        <MenuItem value={UNKNOWN_CREATOR}>Unknown</MenuItem>
        {creators.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
