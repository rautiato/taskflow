import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import type { SxProps, Theme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import type { Project } from '../../../models/project'
import type { UserDto } from '../../../models/user'
import {
  PRIORITIES,
  PROJECT_STATUS_FILTERS,
  UNASSIGNED,
  UNKNOWN_CREATOR,
  type DueFilter,
  type TaskListFilters,
  type ProjectStatusFilter,
} from '../../tasks/taskListFilters'
import { testIdProps } from '../../../utils/testIdProps'
import { MultiSelectFilter } from './MultiSelectFilter'

const DUE_OPTIONS: { value: DueFilter; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'next7', label: 'Next 7 days' },
  { value: 'none', label: 'No due date' },
]

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
  // Desktops: search takes whatever room the fixed-width filters leave,
  // down to 220px before the bar wraps.
  search: {
    gridColumn: '1 / -1',
    flex: { md: '1 1 220px' },
  },
  searchIcon: {
    fontSize: 18,
    color: 'text.secondary',
  },
  // Same fixed width as the multi-select filters, so the bar fits one row
  // on common desktop widths.
  projectStatus: {
    width: { md: 140 },
  },
} satisfies Record<string, SxProps<Theme>>

export function TaskListFilterBar({
  filters,
  onChange,
  projects,
  statusOptions,
  creators,
  assignees,
}: {
  filters: TaskListFilters
  onChange: (filters: TaskListFilters) => void
  projects: Project[]
  statusOptions: string[]
  creators: UserDto[]
  // Shows the Assignee filter (All Tasks); omit it where every task is
  // the viewer's own (My Tasks).
  assignees?: UserDto[]
}) {
  return (
    <Box data-testid="task-list-filter-bar" sx={styles.root}>
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        sx={styles.search}
        slotProps={{
          htmlInput: {
            ...testIdProps('task-list-filter-bar-search'),
            'aria-label': 'Search tasks',
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIcon} />
              </InputAdornment>
            ),
          },
        }}
      />
      {assignees && (
        <MultiSelectFilter
          label="Assignee"
          value={filters.assigneeIds}
          options={[
            { value: UNASSIGNED, label: 'Unassigned' },
            ...assignees.map((u) => ({ value: u.id, label: u.name })),
          ]}
          onChange={(assigneeIds) => onChange({ ...filters, assigneeIds })}
          testId="task-list-filter-bar-assignee"
        />
      )}
      <MultiSelectFilter
        label="Project"
        value={filters.projectIds}
        options={projects.map((p) => ({
          value: p.id,
          label: p.name,
          menuLabel: p.status === 'Closed' ? `${p.name} (Closed)` : undefined,
        }))}
        // Changing projects invalidates statuses picked from the previous set.
        onChange={(projectIds) =>
          onChange({ ...filters, projectIds, statusNames: [] })
        }
        width={200}
        testId="task-list-filter-bar-project"
      />
      <TextField
        size="small"
        select
        label="Project status"
        value={filters.projectStatus}
        onChange={(event) =>
          onChange({
            ...filters,
            projectStatus: event.target.value as ProjectStatusFilter,
          })
        }
        sx={styles.projectStatus}
        slotProps={{
          htmlInput: testIdProps('task-list-filter-bar-project-status'),
        }}
      >
        {PROJECT_STATUS_FILTERS.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>
      <MultiSelectFilter
        label="Status"
        value={filters.statusNames}
        options={statusOptions.map((name) => ({ value: name, label: name }))}
        onChange={(statusNames) => onChange({ ...filters, statusNames })}
        testId="task-list-filter-bar-status"
      />
      <MultiSelectFilter
        label="Priority"
        value={filters.priorities}
        options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        onChange={(priorities) => onChange({ ...filters, priorities })}
        testId="task-list-filter-bar-priority"
      />
      <MultiSelectFilter
        label="Due date"
        value={filters.due}
        options={DUE_OPTIONS}
        onChange={(due) => onChange({ ...filters, due })}
        testId="task-list-filter-bar-due"
      />
      <MultiSelectFilter
        label="Created By"
        value={filters.createdByIds}
        options={[
          { value: UNKNOWN_CREATOR, label: 'Unknown' },
          ...creators.map((u) => ({ value: u.id, label: u.name })),
        ]}
        onChange={(createdByIds) => onChange({ ...filters, createdByIds })}
        testId="task-list-filter-bar-created-by"
      />
    </Box>
  )
}
