import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import { FavoriteToggle } from './FavoriteToggle'
import { PriorityChip } from './PriorityChip'

export function TaskCard({
  task,
  isDoneColumn,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  task: TaskItem
  isDoneColumn: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleFavorite: () => void
}) {
  const dueChip = getDueChip(task, isDoneColumn)
  const priorityStyle = PRIORITY_STYLES[task.priority]

  return (
    <Box
      onClick={onClick}
      data-testid="task-card"
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
        <FavoriteToggle
          isFavorite={task.isFavorite}
          onToggle={onToggleFavorite}
        />
        <Typography
          data-testid="task-card-title"
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
        <PriorityChip
          priority={task.priority}
          sx={{ fontSize: 10, px: 0.875 }}
        />
        {dueChip && (
          <Box
            data-testid="task-card-due"
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
              // Touch screens can't hover, so keep the actions visible.
              '@media (hover: none)': { opacity: 1 },
            }}
          >
            {onEdit && (
              <IconButton
                size="small"
                aria-label={`Edit ${task.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                sx={{ p: 0.75 }}
                data-testid="task-card-edit"
              >
                <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                aria-label={`Delete ${task.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                sx={{ p: 0.75 }}
                data-testid="task-card-delete"
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
