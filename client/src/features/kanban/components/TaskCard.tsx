import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  DeleteIconButton,
  EditIconButton,
} from '../../../components/ActionIconButtons'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import { FavoriteToggle } from './FavoriteToggle'
import { PriorityChip } from './PriorityChip'

const styles = {
  root: {
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
    '&:hover .task-card-actions': { opacity: 1 },
  },
  rootDone: {
    opacity: 0.75,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.875,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    flexGrow: 1,
  },
  titleDone: {
    textDecoration: 'line-through',
    color: 'text.secondary',
  },
  chipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
  },
  priorityChip: {
    fontSize: 10,
    px: 0.875,
  },
  due: {
    fontSize: 10,
    fontWeight: 600,
    px: 0.875,
    py: 0.25,
    borderRadius: 999,
  },
  actions: {
    display: 'flex',
    gap: 0.25,
    ml: 'auto',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    // Touch screens can't hover, so keep the actions visible.
    '@media (hover: none)': { opacity: 1 },
  },
  actionButton: {
    p: 0.75,
  },
} satisfies Record<string, SxProps<Theme>>

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
      sx={[
        styles.root,
        isDoneColumn && styles.rootDone,
        task.isFavorite &&
          !isDoneColumn && {
            borderLeft: 3,
            borderLeftColor: priorityStyle.color,
          },
      ]}
    >
      <Box sx={styles.titleRow}>
        <FavoriteToggle
          isFavorite={task.isFavorite}
          onToggle={onToggleFavorite}
        />
        <Typography
          data-testid="task-card-title"
          sx={[styles.title, isDoneColumn && styles.titleDone]}
        >
          {task.title}
        </Typography>
      </Box>
      <Box sx={styles.chipRow}>
        <PriorityChip priority={task.priority} sx={styles.priorityChip} />
        {dueChip && (
          <Box data-testid="task-card-due" sx={[dueChip.sx, styles.due]}>
            {dueChip.label}
          </Box>
        )}
        {(onEdit || onDelete) && (
          <Box className="task-card-actions" sx={styles.actions}>
            {onEdit && (
              <EditIconButton
                aria-label={`Edit ${task.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                sx={styles.actionButton}
                data-testid="task-card-edit"
              />
            )}
            {onDelete && (
              <DeleteIconButton
                aria-label={`Delete ${task.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                sx={styles.actionButton}
                data-testid="task-card-delete"
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
