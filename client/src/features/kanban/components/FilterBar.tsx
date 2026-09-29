import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { TaskPriority } from '../../../models/task'
import type { UserDto } from '../../../models/user'
import {
  ALL,
  UNASSIGNED,
  UNKNOWN_CREATOR,
  type TaskFilters,
} from '../../tasks/filterTasks'
import { testIdProps } from '../../../utils/testIdProps'

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
    // Phones: 2-column grid with search spanning both columns.
    // Wider screens: one wrapping row.
    <Box
      data-testid="filter-bar"
      sx={{
        display: { xs: 'grid', sm: 'flex' },
        gridTemplateColumns: '1fr 1fr',
        flexWrap: 'wrap',
        gap: 1.5,
      }}
    >
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        sx={{ gridColumn: '1 / -1', width: { sm: 300 } }}
        slotProps={{
          htmlInput: testIdProps('filter-bar-search'),
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
        sx={{ minWidth: { sm: 140 } }}
        slotProps={{
          select: { SelectDisplayProps: testIdProps('filter-bar-status') },
        }}
      >
        <MenuItem value={ALL} data-testid="filter-bar-status-option-all">
          All
        </MenuItem>
        {columns.map((column) => (
          <MenuItem
            key={column.id}
            value={column.id}
            data-testid="filter-bar-status-option"
          >
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
        sx={{ minWidth: { sm: 140 } }}
        slotProps={{
          select: { SelectDisplayProps: testIdProps('filter-bar-priority') },
        }}
      >
        <MenuItem value={ALL} data-testid="filter-bar-priority-option-all">
          All
        </MenuItem>
        {PRIORITIES.map((priority) => (
          <MenuItem
            key={priority}
            value={priority}
            data-testid={`filter-bar-priority-option-${priority.toLowerCase()}`}
          >
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
        sx={{ minWidth: { sm: 160 } }}
        slotProps={{
          select: { SelectDisplayProps: testIdProps('filter-bar-assignee') },
        }}
      >
        <MenuItem value={ALL} data-testid="filter-bar-assignee-option-all">
          All
        </MenuItem>
        <MenuItem
          value={UNASSIGNED}
          data-testid="filter-bar-assignee-option-unassigned"
        >
          Unassigned
        </MenuItem>
        {users.map((user) => (
          <MenuItem
            key={user.id}
            value={user.id}
            data-testid="filter-bar-assignee-option"
          >
            {user.name}
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
            createdById: event.target.value as TaskFilters['createdById'],
          })
        }
        sx={{ minWidth: { sm: 160 } }}
        slotProps={{
          select: { SelectDisplayProps: testIdProps('filter-bar-created-by') },
        }}
      >
        <MenuItem value={ALL} data-testid="filter-bar-created-by-option-all">
          All
        </MenuItem>
        <MenuItem
          value={UNKNOWN_CREATOR}
          data-testid="filter-bar-created-by-option-unknown"
        >
          Unknown
        </MenuItem>
        {users.map((user) => (
          <MenuItem
            key={user.id}
            value={user.id}
            data-testid="filter-bar-created-by-option"
          >
            {user.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
