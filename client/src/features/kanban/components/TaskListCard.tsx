import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { UserAvatar } from '../../../components/UserAvatar'
import {
  DeleteIconButton,
  EditIconButton,
} from '../../../components/ActionIconButtons'
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
  metaText: {
    fontSize: 12,
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
    <Box onClick={onClick} sx={styles.root} data-testid="task-row">
      <FavoriteToggle
        isFavorite={task.isFavorite}
        onToggle={onToggleFavorite}
        size={18}
      />
      <Box sx={styles.body}>
        <Typography
          sx={[styles.title, isDone && styles.titleDone]}
          data-testid="task-row-title"
        >
          {task.title}
        </Typography>
        <Box sx={styles.chipRow}>
          <Box
            sx={[styles.chip, PRIORITY_STYLES[task.priority]]}
            data-testid="priority-chip"
          >
            {task.priority}
          </Box>
          <Box
            sx={[styles.chip, styles.statusChip]}
            data-testid="task-row-status"
          >
            {statusName}
          </Box>
          {dueChip && (
            <Box sx={[styles.chip, dueChip.sx]} data-testid="task-row-due">
              {dueChip.label}
            </Box>
          )}
        </Box>
        <Box sx={styles.meta}>
          <UserAvatar
            id={assignee?.id}
            name={assignee?.name ?? null}
            avatarUrl={assignee?.avatarUrl}
            size="xs"
          />
          <Typography noWrap sx={styles.metaText}>
            <span data-testid="task-row-assignee">
              {assignee?.name ?? 'Unassigned'}
            </span>
            {projectName && (
              <>
                {' · '}
                <span data-testid="task-row-project">{projectName}</span>
              </>
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.actions}>
        <EditIconButton
          aria-label={`Edit ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          data-testid="task-row-edit"
        />
        <DeleteIconButton
          aria-label={`Delete ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          data-testid="task-row-delete"
        />
      </Box>
    </Box>
  )
}
