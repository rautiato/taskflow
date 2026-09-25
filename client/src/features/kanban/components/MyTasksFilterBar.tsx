import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import type { Project } from '../../../models/project'
import type { UserDto } from '../../../models/user'
import {
  PRIORITIES,
  UNKNOWN_CREATOR,
  type DueFilter,
  type MyTasksFilters,
} from '../../tasks/filterMyTasks'
import { MultiSelectFilter } from './MultiSelectFilter'

const DUE_OPTIONS: { value: DueFilter; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'next7', label: 'Next 7 days' },
  { value: 'none', label: 'No due date' },
]

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
      <MultiSelectFilter
        label="Project"
        value={filters.projectIds}
        options={projects.map((p) => ({ value: p.id, label: p.name }))}
        // Changing projects invalidates statuses picked from the previous set.
        onChange={(projectIds) =>
          onChange({ ...filters, projectIds, statusNames: [] })
        }
        minWidth={180}
      />
      <MultiSelectFilter
        label="Status"
        value={filters.statusNames}
        options={statusOptions.map((name) => ({ value: name, label: name }))}
        onChange={(statusNames) => onChange({ ...filters, statusNames })}
      />
      <MultiSelectFilter
        label="Priority"
        value={filters.priorities}
        options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        onChange={(priorities) => onChange({ ...filters, priorities })}
        minWidth={140}
      />
      <MultiSelectFilter
        label="Due date"
        value={filters.due}
        options={DUE_OPTIONS}
        onChange={(due) => onChange({ ...filters, due })}
      />
      <MultiSelectFilter
        label="Created By"
        value={filters.createdByIds}
        options={[
          { value: UNKNOWN_CREATOR, label: 'Unknown' },
          ...creators.map((u) => ({ value: u.id, label: u.name })),
        ]}
        onChange={(createdByIds) => onChange({ ...filters, createdByIds })}
      />
    </Box>
  )
}
