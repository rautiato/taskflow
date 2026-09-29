import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { UserAvatar } from '../../../components/UserAvatar'
import { getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { FavoriteToggle } from './FavoriteToggle'
import { PriorityChip } from './PriorityChip'

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
      sx={{
        display: 'grid',
        gridTemplateColumns: columnTemplate,
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
      }}
    >
      <FavoriteToggle
        isFavorite={task.isFavorite}
        onToggle={onToggleFavorite}
        size={18}
      />
      <Typography
        data-testid="task-row-title"
        sx={{
          fontSize: 13,
          fontWeight: 600,
          ...(isDone && {
            textDecoration: 'line-through',
            color: 'text.secondary',
          }),
        }}
      >
        {task.title}
      </Typography>
      {projectName !== undefined && (
        <Typography
          sx={{ fontSize: 13, color: 'text.secondary' }}
          data-testid="task-row-project"
        >
          {projectName}
        </Typography>
      )}
      <PriorityChip priority={task.priority} sx={{ width: 'fit-content' }} />
      <Typography
        sx={{ fontSize: 13, color: 'text.secondary' }}
        data-testid="task-row-status"
      >
        {column?.name ?? 'Unknown'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UserAvatar
          id={assignee?.id}
          name={assignee?.name ?? null}
          avatarUrl={assignee?.avatarUrl}
          size="xs"
        />
        <Typography sx={{ fontSize: 13 }} data-testid="task-row-assignee">
          {assignee?.name ?? 'Unassigned'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UserAvatar
          id={creator?.id}
          name={creator?.name ?? null}
          avatarUrl={creator?.avatarUrl}
          size="xs"
        />
        <Typography sx={{ fontSize: 13 }} data-testid="task-row-creator">
          {creator?.name ?? 'Unknown'}
        </Typography>
      </Box>
      {dueChip ? (
        <Box
          data-testid="task-row-due"
          sx={{
            ...dueChip.sx,
            fontSize: 11,
            fontWeight: 600,
            px: 1,
            py: 0.25,
            borderRadius: 999,
            width: 'fit-content',
          }}
        >
          {dueChip.label}
        </Box>
      ) : (
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>—</Typography>
      )}
      <Box
        className="row-actions"
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 0.5,
          opacity: 0,
          transition: 'opacity 0.15s ease',
          // Touch screens can't hover, so keep the actions visible.
          '@media (hover: none)': { opacity: 1 },
        }}
      >
        <IconButton
          size="small"
          aria-label={`Edit ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          sx={{ p: 0.75 }}
          data-testid="task-row-edit"
        >
          <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        </IconButton>
        <IconButton
          size="small"
          aria-label={`Delete ${task.title}`}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          sx={{ p: 0.75 }}
          data-testid="task-row-delete"
        >
          <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
        </IconButton>
      </Box>
    </Box>
  )
}
