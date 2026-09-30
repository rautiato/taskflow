import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { CommentThread } from './CommentThread'
import { FavoriteToggle } from './FavoriteToggle'
import { TaskDetailMeta } from './TaskDetailMeta'
import { TaskAttachmentsSection } from './TaskAttachmentsSection'
import { testIdProps } from '../../../utils/testIdProps'

const styles = {
  root: {
    width: { xs: '100vw', sm: 640 },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'relative',
    px: { xs: 2, sm: 4 },
    pt: 3,
    pb: 2.5,
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  copyLinkButton: {
    position: 'absolute',
    top: 12,
    right: 52,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.25,
    pr: 9,
  },
  title: {
    lineHeight: 1.3,
  },
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    px: { xs: 2, sm: 4 },
    py: 2.5,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  descriptionBox: {
    bgcolor: 'background.default',
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    px: 2,
    py: 1.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 1.5,
    px: { xs: 2, sm: 4 },
    py: 2.5,
    borderTop: 1,
    borderColor: 'divider',
  },
  deleteButton: {
    minWidth: 140,
    bgcolor: 'error.light',
    color: 'error.main',
    boxShadow: 'none',
    '&:hover': { bgcolor: 'error.light', boxShadow: 'none' },
  },
  editButton: {
    minWidth: 140,
  },
} satisfies Record<string, SxProps<Theme>>

export function TaskDetailDrawer({
  task,
  columns,
  users,
  currentUser,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  task: TaskItem | null
  columns: KanbanColumn[]
  users: UserDto[]
  currentUser: UserDto
  onClose: () => void
  onEdit: (task: TaskItem) => void
  onDelete: (task: TaskItem) => void
  onToggleFavorite: (task: TaskItem) => void
}) {
  // Keyed by task id, so "Link copied" resets when another task opens.
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null)

  if (!task) return null
  const column = columns.find((c) => c.id === task.columnId)
  const assignee = users.find((u) => u.id === task.assigneeId)
  const creator = users.find((u) => u.id === task.createdById)

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      slotProps={{ paper: testIdProps('task-detail-drawer') }}
    >
      <Box sx={styles.root}>
        <Box sx={styles.header}>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close"
            sx={styles.closeButton}
            data-testid="task-detail-drawer-close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Tooltip
            title={copiedTaskId === task.id ? 'Link copied' : 'Copy link'}
          >
            <IconButton
              onClick={() => {
                // Short link — survives the task moving to another project.
                navigator.clipboard.writeText(
                  `${window.location.origin}/tasks/${task.id}`,
                )
                setCopiedTaskId(task.id)
              }}
              size="small"
              aria-label="Copy link to task"
              sx={styles.copyLinkButton}
              data-testid="task-detail-drawer-copy-link"
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={styles.titleRow}>
            <FavoriteToggle
              isFavorite={task.isFavorite}
              onToggle={() => onToggleFavorite(task)}
              size={24}
            />
            <Typography
              variant="pageTitle"
              sx={styles.title}
              data-testid="task-detail-drawer-title"
            >
              {task.title}
            </Typography>
          </Box>

          <TaskDetailMeta
            task={task}
            column={column}
            assignee={assignee}
            creator={creator}
          />
        </Box>

        <Box sx={styles.body}>
          <Box sx={styles.section}>
            <Typography variant="sectionLabel">Description</Typography>
            <Box sx={styles.descriptionBox}>
              <Typography
                sx={styles.description}
                data-testid="task-detail-drawer-description"
              >
                {task.description || 'No description provided.'}
              </Typography>
            </Box>
          </Box>

          <TaskAttachmentsSection taskId={task.id} />

          <Divider />

          <CommentThread
            taskId={task.id}
            users={users}
            currentUser={currentUser}
          />
        </Box>

        <Box sx={styles.footer}>
          <Button
            onClick={() => onDelete(task)}
            variant="contained"
            startIcon={<DeleteIcon />}
            data-testid="task-detail-drawer-delete"
            sx={styles.deleteButton}
          >
            Delete
          </Button>
          <Button
            onClick={() => onEdit(task)}
            variant="outlined"
            startIcon={<EditIcon />}
            data-testid="task-detail-drawer-edit"
            sx={styles.editButton}
          >
            Edit
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
