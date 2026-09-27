import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { SxProps, Theme } from '@mui/material/styles'
import { UserAvatar } from '../../../components/UserAvatar'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import type { UserDto } from '../../../models/user'
import { FavoriteToggle } from './FavoriteToggle'

const styles = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.25,
    px: 2,
    py: 1.5,
    cursor: 'pointer',
    '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
    '&:active': { bgcolor: 'action.hover' },
  },
  body: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
  },
  titleDone: {
    textDecoration: 'line-through',
    color: 'text.secondary',
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.75,
  },
  chip: {
    fontSize: 11,
    fontWeight: 700,
    px: 1,
    py: 0.25,
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
  statusChip: {
    bgcolor: 'action.hover',
    color: 'text.secondary',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
    color: 'text.secondary',
    minWidth: 0,
  },
  actions: {
    display: 'flex',
    gap: 0.25,
    mt: -0.5,
  },
} satisfies Record<string, SxProps<Theme>>

// Phone layout of one task-list row: the table's columns stacked into a
// card, so nothing needs sideways scrolling.
export function TaskListCard({
  task,
  isDone,
  statusName,
  assignee,
  projectName,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  task: TaskItem
  isDone: boolean
  statusName: string
  assignee?: UserDto
  projectName?: string
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}) {
  const dueChip = getDueChip(task, isDone)

  return (
    <Box onClick={onClick} sx={styles.root}>
      <FavoriteToggle
        isFavorite={task.isFavorite}
        onToggle={onToggleFavorite}
        size={18}
      />
      <Box sx={styles.body}>
        <Typography sx={[styles.title, isDone && styles.titleDone]}>
          {task.title}
        </Typography>
        <Box sx={styles.chipRow}>
          <Box sx={[styles.chip, PRIORITY_STYLES[task.priority]]}>
            {task.priority}
          </Box>
          <Box sx={[styles.chip, styles.statusChip]}>{statusName}</Box>
          {dueChip && <Box sx={[styles.chip, dueChip.sx]}>{dueChip.label}</Box>}
        </Box>
        <Box sx={styles.meta}>
          <UserAvatar
            id={assignee?.id}
            name={assignee?.name ?? null}
            avatarUrl={assignee?.avatarUrl}
            size="xs"
          />
          <Typography noWrap sx={{ fontSize: 12 }}>
            {assignee?.name ?? 'Unassigned'}
            {projectName && ` · ${projectName}`}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.actions}>
        <IconButton
          size="small"
          aria-label="Edit task"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
        >
          <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Delete task"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
