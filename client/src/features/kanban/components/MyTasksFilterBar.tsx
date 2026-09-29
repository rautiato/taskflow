import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import type { SxProps, Theme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import type { Project } from '../../../models/project'
import type { UserDto } from '../../../models/user'
import {
  PRIORITIES,
  UNKNOWN_CREATOR,
  type DueFilter,
  type MyTasksFilters,
} from '../../tasks/filterMyTasks'
import { testIdProps } from '../../../utils/testIdProps'
import { MultiSelectFilter } from './MultiSelectFilter'

const DUE_OPTIONS: { value: DueFilter; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'next7', label: 'Next 7 days' },
  { value: 'none', label: 'No due date' },
]

const styles = {
  // Phones: 2-column grid with search spanning both columns.
  // Wider screens: one wrapping row.
  root: {
    display: { xs: 'grid', sm: 'flex' },
    gridTemplateColumns: '1fr 1fr',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  search: {
    gridColumn: '1 / -1',
    width: { sm: 300 },
  },
  searchIcon: {
    fontSize: 18,
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

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
    <Box data-testid="my-tasks-filter-bar" sx={styles.root}>
      <TextField
        size="small"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        sx={styles.search}
        slotProps={{
          htmlInput: testIdProps('my-tasks-filter-bar-search'),
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIcon} />
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
        testId="my-tasks-filter-bar-project"
      />
      <MultiSelectFilter
        label="Status"
        value={filters.statusNames}
        options={statusOptions.map((name) => ({ value: name, label: name }))}
        onChange={(statusNames) => onChange({ ...filters, statusNames })}
        testId="my-tasks-filter-bar-status"
      />
      <MultiSelectFilter
        label="Priority"
        value={filters.priorities}
        options={PRIORITIES.map((p) => ({ value: p, label: p }))}
        onChange={(priorities) => onChange({ ...filters, priorities })}
        minWidth={140}
        testId="my-tasks-filter-bar-priority"
      />
      <MultiSelectFilter
        label="Due date"
        value={filters.due}
        options={DUE_OPTIONS}
        onChange={(due) => onChange({ ...filters, due })}
        testId="my-tasks-filter-bar-due"
      />
      <MultiSelectFilter
        label="Created By"
        value={filters.createdByIds}
        options={[
          { value: UNKNOWN_CREATOR, label: 'Unknown' },
          ...creators.map((u) => ({ value: u.id, label: u.name })),
        ]}
        onChange={(createdByIds) => onChange({ ...filters, createdByIds })}
        testId="my-tasks-filter-bar-created-by"
      />
    </Box>
  )
}
