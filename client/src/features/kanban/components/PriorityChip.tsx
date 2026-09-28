import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { PRIORITY_STYLES } from '../../tasks/taskDisplay'
import type { TaskPriority } from '../../../models/task'

/** Coloured pill for a task's priority. `sx` adjusts its size per screen. */
export function PriorityChip({
  priority,
  sx,
}: {
  priority: TaskPriority
  sx?: SxProps<Theme>
}) {
  return (
    <Box
      component="span"
      sx={[
        PRIORITY_STYLES[priority],
        {
          fontSize: 11,
          fontWeight: 700,
          px: 1,
          py: 0.25,
          borderRadius: 999,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {priority}
    </Box>
  )
}
