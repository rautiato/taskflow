import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'

export function TaskCard({
  task,
  isDoneColumn,
  onClick,
  onEdit,
  onDelete,
}: {
  task: TaskItem
  isDoneColumn: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
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
        '&:hover .task-card-actions': { opacity: 1 },
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
        {(onEdit || onDelete) && (
          <Box
            className="task-card-actions"
            sx={{
              display: 'flex',
              gap: 0.25,
              ml: 'auto',
              opacity: 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                sx={{ p: 0.75 }}
              >
                <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                sx={{ p: 0.75 }}
              >
                <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
