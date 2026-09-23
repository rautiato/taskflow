import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'

const PRIORITY_STYLES = {
  High: { bgcolor: 'error.light', color: 'error.main' },
  Medium: { bgcolor: 'warning.light', color: 'warning.main' },
  Low: { bgcolor: 'success.light', color: 'success.main' },
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TaskDetailDrawer({
  open,
  task,
  column,
  assignee,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean
  task: TaskItem | null
  column: KanbanColumn | undefined
  assignee: UserDto | undefined
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  if (!task) return null
  const priorityStyle = PRIORITY_STYLES[task.priority]

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            Task Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 3,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {task.isFavorite ? (
              <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
            ) : (
              <StarBorderIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
            )}
            <Box
              sx={{
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 999,
                px: 1.25,
                py: 0.25,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {column?.name ?? 'Unknown'}
            </Box>
            <Box
              sx={{
                ...priorityStyle,
                borderRadius: 999,
                px: 1.25,
                py: 0.25,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {task.priority}
            </Box>
          </Box>

          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            {task.title}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              Assignee
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              {assignee?.name ?? 'Unassigned'}
            </Typography>
          </Box>

          {task.dueDate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Deadline
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                {formatDate(task.dueDate)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              Description
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.6 }}>
              {task.description}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            px: 3,
            py: 2.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={onEdit}
            variant="outlined"
            startIcon={<EditIcon />}
            fullWidth
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            fullWidth
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
