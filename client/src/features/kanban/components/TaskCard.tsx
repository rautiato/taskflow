import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'

export function TaskCard({
  task,
  isDoneColumn,
  onClick,
}: {
  task: TaskItem
  isDoneColumn: boolean
  onClick?: () => void
}) {
  const dueChip = getDueChip(task, isDoneColumn)
  const priorityStyle = PRIORITY_STYLES[task.priority]

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.375,
        py: 1.125,
        boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        cursor: 'pointer',
        ...(isDoneColumn && { opacity: 0.75 }),
        ...(task.isFavorite &&
          !isDoneColumn && {
            borderLeft: 3,
            borderLeftColor: priorityStyle.color,
          }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.875 }}>
        {task.isFavorite ? (
          <StarIcon
            sx={{ fontSize: 16, color: 'warning.main', flexShrink: 0 }}
          />
        ) : (
          <StarBorderIcon
            sx={{ fontSize: 16, color: '#C6CACF', flexShrink: 0 }}
          />
        )}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 600,
            flexGrow: 1,
            ...(isDoneColumn && {
              textDecoration: 'line-through',
              color: 'text.secondary',
            }),
          }}
        >
          {task.title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={{
            ...priorityStyle,
            fontSize: 10,
            fontWeight: 700,
            px: 0.875,
            py: 0.25,
            borderRadius: 999,
          }}
        >
          {task.priority}
        </Box>
        {dueChip && (
          <Box
            sx={{
              ...dueChip.sx,
              fontSize: 10,
              fontWeight: 600,
              px: 0.875,
              py: 0.25,
              borderRadius: 999,
            }}
          >
            {dueChip.label}
          </Box>
        )}
      </Box>
    </Box>
  )
}
