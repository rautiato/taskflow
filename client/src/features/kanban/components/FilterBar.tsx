import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { TaskPriority } from '../../../models/task'
import type { UserDto } from '../../../models/user'
import { ALL, UNASSIGNED, type TaskFilters } from '../../tasks/filterTasks'

const PRIORITIES: TaskPriority[] = ['High', 'Medium', 'Low']

export function FilterBar({
  filters,
  onChange,
  columns,
  users,
}: {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
  columns: KanbanColumn[]
  users: UserDto[]
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
        label="Status"
        value={filters.columnId}
        onChange={(event) =>
          onChange({ ...filters, columnId: event.target.value })
        }
        sx={{ minWidth: 140 }}
      >
        <MenuItem value={ALL}>All</MenuItem>
        {columns.map((column) => (
          <MenuItem key={column.id} value={column.id}>
            {column.name}
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
            priority: event.target.value as TaskFilters['priority'],
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
        label="Assignee"
        value={filters.assigneeId}
        onChange={(event) =>
          onChange({
            ...filters,
            assigneeId: event.target.value as TaskFilters['assigneeId'],
          })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value={ALL}>All</MenuItem>
        <MenuItem value={UNASSIGNED}>Unassigned</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
