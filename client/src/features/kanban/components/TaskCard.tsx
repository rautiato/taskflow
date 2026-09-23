import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import type { TaskItem } from '../../../models/task'

const PRIORITY_STYLES = {
  High: { bgcolor: 'error.light', color: 'error.main' },
  Medium: { bgcolor: 'warning.light', color: 'warning.main' },
  Low: { bgcolor: 'success.light', color: 'success.main' },
} as const

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  })
}

function getDueChip(task: TaskItem, isDone: boolean) {
  if (isDone) {
    return {
      label: `Completed ${formatShortDate(task.updatedAt)}`,
      sx: { bgcolor: 'success.light', color: 'success.main' },
    }
  }
  if (!task.dueDate) return null
  const diffDays = Math.ceil(
    (new Date(task.dueDate).getTime() - startOfDay(new Date()).getTime()) /
      86_400_000,
  )
  if (diffDays < 0) {
    return {
      label: `Overdue · ${formatShortDate(task.dueDate)}`,
      sx: { bgcolor: 'error.light', color: 'error.main' },
    }
  }
  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      sx: { bgcolor: 'warning.light', color: 'warning.main' },
    }
  }
  return {
    label: `Due ${formatShortDate(task.dueDate)}`,
    sx: { bgcolor: '#EEF0F2', color: 'text.secondary' },
  }
}

export function TaskCard({
  task,
  isDoneColumn,
}: {
  task: TaskItem
  isDoneColumn: boolean
}) {
  const dueChip = getDueChip(task, isDoneColumn)
  const priorityStyle = PRIORITY_STYLES[task.priority]

  return (
    <Box
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
