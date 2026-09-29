import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { UserAvatar } from '../../../components/UserAvatar'
import {
  DeleteIconButton,
  EditIconButton,
} from '../../../components/ActionIconButtons'
import { getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { FavoriteToggle } from './FavoriteToggle'
import { PriorityChip } from './PriorityChip'

const styles = {
  root: {
    display: 'grid',
    gap: 1,
    alignItems: 'center',
    px: 2,
    py: 1.25,
    borderBottom: 1,
    borderColor: 'divider',
    cursor: 'pointer',
    '&:last-of-type': { borderBottom: 0 },
    '&:hover': { bgcolor: 'action.hover' },
    '&:hover .row-actions': { opacity: 1 },
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
  },
  titleDone: {
    textDecoration: 'line-through',
    color: 'text.secondary',
  },
  priorityChip: {
    width: 'fit-content',
  },
  person: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  personName: {
    fontSize: 13,
  },
  due: {
    fontSize: 11,
    fontWeight: 600,
    px: 1,
    py: 0.25,
    borderRadius: 999,
    width: 'fit-content',
  },
  noDue: {
    fontSize: 12,
    color: 'text.disabled',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 0.5,
    opacity: 0,
    transition: 'opacity 0.15s ease',
    // Touch screens can't hover, so keep the actions visible.
    '@media (hover: none)': { opacity: 1 },
  },
  actionButton: {
    p: 0.75,
  },
} satisfies Record<string, SxProps<Theme>>

// Desktop and tablet layout of one task-list row; TaskListCard is the phone
// layout of the same row.
export function TaskListRow({
  task,
  column,
  assignee,
  creator,
  projectName,
  columnTemplate,
  onClick,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  task: TaskItem
  column?: KanbanColumn
  assignee?: UserDto
  creator?: UserDto
  // Undefined hides the Project column.
  projectName?: string
  columnTemplate: string
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}) {
  const isDone = column?.isDone ?? false
  const dueChip = getDueChip(task, isDone)

  return (
    <Box
      onClick={onClick}
      data-testid="task-row"
      sx={[styles.root, { gridTemplateColumns: columnTemplate }]}
    >
      <FavoriteToggle
        isFavorite={task.isFavorite}
        onToggle={onToggleFavorite}
        size={18}
      />
      <Typography
        data-testid="task-row-title"
        sx={[styles.title, isDone && styles.titleDone]}
      >
        {task.title}
      </Typography>
      {projectName !== undefined && (
        <Typography variant="secondaryText" data-testid="task-row-project">
          {projectName}
        </Typography>
      )}
      <PriorityChip priority={task.priority} sx={styles.priorityChip} />
      <Typography variant="secondaryText" data-testid="task-row-status">
        {column?.name ?? 'Unknown'}
      </Typography>
      <Box sx={styles.person}>
        <UserAvatar
          id={assignee?.id}
          name={assignee?.name ?? null}
          avatarUrl={assignee?.avatarUrl}
          size="xs"
        />
        <Typography sx={styles.personName} data-testid="task-row-assignee">
          {assignee?.name ?? 'Unassigned'}
        </Typography>
      </Box>
      <Box sx={styles.person}>
        <UserAvatar
          id={creator?.id}
          name={creator?.name ?? null}
          avatarUrl={creator?.avatarUrl}
          size="xs"
        />
        <Typography sx={styles.personName} data-testid="task-row-creator">
          {creator?.name ?? 'Unknown'}
        </Typography>
      </Box>
      {dueChip ? (
        <Box data-testid="task-row-due" sx={[dueChip.sx, styles.due]}>
          {dueChip.label}
        </Box>
      ) : (
        <Typography sx={styles.noDue}>—</Typography>
      )}
      <Box className="row-actions" sx={styles.actions}>
        <EditIconButton
          aria-label={`Edit ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          sx={styles.actionButton}
          data-testid="task-row-edit"
        />
        <DeleteIconButton
          aria-label={`Delete ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          sx={styles.actionButton}
          data-testid="task-row-delete"
        />
      </Box>
    </Box>
  )
}
