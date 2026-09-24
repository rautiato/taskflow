import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { UserAvatar } from '../../../components/UserAvatar'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'

export const LIST_VIEW_COLUMN_TEMPLATE = '32px 2.5fr 1fr 1fr 1fr 1.5fr'
const HEADER_LABELS = ['Task', 'Priority', 'Status', 'Assignee', 'Due Date']

export function TaskListView({
  tasks,
  columns,
  users,
  onTaskClick,
}: {
  tasks: TaskItem[]
  columns: KanbanColumn[]
  users: UserDto[]
  onTaskClick: (task: TaskItem) => void
}) {
  const columnById = new Map(columns.map((c) => [c.id, c]))
  const userById = new Map(users.map((u) => [u.id, u]))

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: LIST_VIEW_COLUMN_TEMPLATE,
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: '#F5F6F8',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box />
        {HEADER_LABELS.map((label) => (
          <Typography
            key={label}
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {tasks.length === 0 ? (
        <Box sx={{ px: 2, py: 3 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            No tasks match these filters.
          </Typography>
        </Box>
      ) : (
        tasks.map((task) => {
          const column = columnById.get(task.columnId)
          const assignee = task.assigneeId
            ? userById.get(task.assigneeId)
            : undefined
          const isDone = column?.isDone ?? false
          const priorityStyle = PRIORITY_STYLES[task.priority]
          const dueChip = getDueChip(task, isDone)

          return (
            <Box
              key={task.id}
              onClick={() => onTaskClick(task)}
              sx={{
                display: 'grid',
                gridTemplateColumns: LIST_VIEW_COLUMN_TEMPLATE,
                gap: 1,
                alignItems: 'center',
                px: 2,
                py: 1.25,
                borderBottom: 1,
                borderColor: 'divider',
                cursor: 'pointer',
                '&:last-of-type': { borderBottom: 0 },
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {task.isFavorite ? (
                <StarIcon sx={{ fontSize: 18, color: 'warning.main' }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: 18, color: '#C6CACF' }} />
              )}
              <Typography
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
              <Box
                sx={{
                  ...priorityStyle,
                  fontSize: 11,
                  fontWeight: 700,
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  width: 'fit-content',
                }}
              >
                {task.priority}
              </Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {column?.name ?? 'Unknown'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UserAvatar name={assignee?.name ?? null} size="xs" />
                <Typography sx={{ fontSize: 13 }}>
                  {assignee?.name ?? 'Unassigned'}
                </Typography>
              </Box>
              {dueChip ? (
                <Box
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
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
                  —
                </Typography>
              )}
            </Box>
          )
        })
      )}
    </Box>
  )
}
