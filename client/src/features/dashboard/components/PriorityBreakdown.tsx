import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { TaskPriority } from '../../../models/task'
import { PRIORITY_STYLES } from '../../tasks/taskDisplay'
import { PRIORITIES } from '../../tasks/filterMyTasks'

const styles = {
  row: {
    display: 'flex',
    gap: 0.75,
  },
  chip: {
    fontSize: 11,
    fontWeight: 700,
    px: 1,
    py: 0.25,
    borderRadius: 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    '&:hover': { filter: 'brightness(0.95)' },
  },
  empty: {
    bgcolor: '#EEF0F2',
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

// Splits a count by priority; the chips always add up to the tile's number.
export function PriorityBreakdown({
  counts,
  hrefFor,
}: {
  counts: Record<TaskPriority, number>
  hrefFor: (priority: TaskPriority) => string
}) {
  return (
    <Box sx={styles.row}>
      {PRIORITIES.map((priority) => (
        <Box
          key={priority}
          component={RouterLink}
          to={hrefFor(priority)}
          sx={[
            styles.chip,
            counts[priority] ? PRIORITY_STYLES[priority] : styles.empty,
          ]}
        >
          {priority} {counts[priority]}
        </Box>
      ))}
    </Box>
  )
}
