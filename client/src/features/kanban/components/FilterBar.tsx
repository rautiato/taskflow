import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import type { SxProps, Theme } from '@mui/material/styles'
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

const styles = {
  // Phones and tablets: a grid (2 columns on phones, as many as fit on
  // tablets) with search on its own row. Desktops: one wrapping row.
  root: {
    display: { xs: 'grid', md: 'flex' },
    gridTemplateColumns: {
      xs: '1fr 1fr',
      sm: 'repeat(auto-fill, minmax(160px, 1fr))',
    },
    flexWrap: 'wrap',
    gap: 1.5,
  },
  search: {
    gridColumn: '1 / -1',
    width: { md: 300 },
  },
  searchIcon: {
    fontSize: 18,
    color: 'text.secondary',
  },
  select: {
    minWidth: { md: 140 },
  },
  personSelect: {
    minWidth: { md: 160 },
  },
} satisfies Record<string, SxProps<Theme>>

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
    <Box data-testid="filter-bar" sx={styles.root}>
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        sx={styles.search}
        slotProps={{
          htmlInput: testIdProps('filter-bar-search'),
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIcon} />
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
        sx={styles.select}
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
        sx={styles.select}
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
        sx={styles.personSelect}
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
        sx={styles.personSelect}
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
