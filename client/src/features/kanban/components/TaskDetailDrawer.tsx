import { useState, type ReactNode } from 'react'
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
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { getDueChip } from '../../tasks/taskDisplay'
import { UserAvatar } from '../../../components/UserAvatar'
import { useAttachments } from '../useAttachments'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { CommentThread } from './CommentThread'
import { ImagePreviewDialog } from './ImagePreviewDialog'
import { FavoriteToggle } from './FavoriteToggle'
import { PriorityChip } from './PriorityChip'
import { testIdProps } from '../../../utils/testIdProps'

const styles = {
  metaRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    alignItems: 'center',
    gap: 1,
    px: 2,
    py: 1.25,
    borderBottom: 1,
    borderColor: 'divider',
    '&:last-of-type': { borderBottom: 0 },
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
  },
  metaValue: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
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
  metaTable: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  metaText: {
    fontSize: 13,
    fontWeight: 600,
  },
  priorityChip: {
    px: 1.25,
  },
  dueIcon: {
    fontSize: 15,
  },
  noDueDate: {
    fontSize: 13,
    color: 'text.disabled',
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
  noAttachments: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'text.disabled',
  },
  noAttachmentsIcon: {
    fontSize: 18,
  },
  noAttachmentsText: {
    fontSize: 13,
  },
  attachments: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },
  attachment: {
    width: 120,
    height: 90,
    borderRadius: 1,
    objectFit: 'cover',
    bgcolor: 'background.default',
    cursor: 'pointer',
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

function MetaRow({
  label,
  testId,
  children,
}: {
  label: string
  testId: string
  children: ReactNode
}) {
  return (
    <Box sx={styles.metaRow}>
      <Typography sx={styles.label}>{label}</Typography>
      <Box sx={styles.metaValue} data-testid={testId}>
        {children}
      </Box>
    </Box>
  )
}

export function TaskDetailDrawer({
  open,
  task,
  column,
  assignee,
  creator,
  users,
  currentUser,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  open: boolean
  task: TaskItem | null
  column: KanbanColumn | undefined
  users: UserDto[]
  currentUser: UserDto
  assignee: UserDto | undefined
  creator: UserDto | undefined
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}) {
  const { attachments } = useAttachments(task?.id ?? '')
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  // Keyed by task id, so "Link copied" resets when another task opens.
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null)

  if (!task) return null
  const dueChip = getDueChip(task, column?.isDone ?? false)

  return (
    <Drawer
      anchor="right"
      open={open}
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
              onToggle={onToggleFavorite}
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

          <Box sx={styles.metaTable}>
            <MetaRow label="Status" testId="task-detail-drawer-status">
              <Typography sx={styles.metaText}>
                {column?.name ?? 'Unknown'}
              </Typography>
            </MetaRow>
            <MetaRow label="Priority" testId="task-detail-drawer-priority">
              <PriorityChip priority={task.priority} sx={styles.priorityChip} />
            </MetaRow>
            <MetaRow label="Assignee" testId="task-detail-drawer-assignee">
              <UserAvatar
                id={assignee?.id}
                name={assignee?.name ?? null}
                avatarUrl={assignee?.avatarUrl}
                size="xs"
              />
              <Typography sx={styles.metaText}>
                {assignee?.name ?? 'Unassigned'}
              </Typography>
            </MetaRow>
            <MetaRow label="Created By" testId="task-detail-drawer-creator">
              <UserAvatar
                id={creator?.id}
                name={creator?.name ?? null}
                avatarUrl={creator?.avatarUrl}
                size="xs"
              />
              <Typography sx={styles.metaText}>
                {creator?.name ?? 'Unknown'}
              </Typography>
            </MetaRow>
            <MetaRow label="Due Date" testId="task-detail-drawer-due-date">
              {dueChip ? (
                <>
                  <CalendarTodayOutlinedIcon
                    sx={[styles.dueIcon, { color: dueChip.sx.color }]}
                  />
                  <Typography
                    sx={[styles.metaText, { color: dueChip.sx.color }]}
                  >
                    {dueChip.label}
                  </Typography>
                </>
              ) : (
                <Typography sx={styles.noDueDate}>No due date</Typography>
              )}
            </MetaRow>
          </Box>
        </Box>

        <Box sx={styles.body}>
          <Box sx={styles.section}>
            <Typography sx={styles.label}>Description</Typography>
            <Box sx={styles.descriptionBox}>
              <Typography
                sx={styles.description}
                data-testid="task-detail-drawer-description"
              >
                {task.description || 'No description provided.'}
              </Typography>
            </Box>
          </Box>

          <Box sx={styles.section}>
            <Typography sx={styles.label}>
              Attachments
              {attachments.length > 0 ? ` (${attachments.length})` : ''}
            </Typography>
            {attachments.length === 0 ? (
              <Box
                sx={styles.noAttachments}
                data-testid="task-detail-drawer-no-attachments"
              >
                <ImageOutlinedIcon sx={styles.noAttachmentsIcon} />
                <Typography sx={styles.noAttachmentsText}>
                  No attachments yet
                </Typography>
              </Box>
            ) : (
              <Box
                sx={styles.attachments}
                data-testid="task-detail-drawer-attachments"
              >
                {attachments.map((a, index) => (
                  <Box
                    key={a.id}
                    component="img"
                    src={a.blobUrl}
                    alt={a.fileName}
                    onClick={() => setPreviewIndex(index)}
                    data-testid="task-detail-drawer-attachment"
                    sx={styles.attachment}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider />

          <CommentThread
            taskId={task.id}
            users={users}
            currentUser={currentUser}
          />
        </Box>

        <Box sx={styles.footer}>
          <Button
            onClick={onDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            data-testid="task-detail-drawer-delete"
            sx={styles.deleteButton}
          >
            Delete
          </Button>
          <Button
            onClick={onEdit}
            variant="outlined"
            startIcon={<EditIcon />}
            data-testid="task-detail-drawer-edit"
            sx={styles.editButton}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <ImagePreviewDialog
        open={previewIndex !== null}
        slides={attachments.map((a) => ({ src: a.blobUrl, alt: a.fileName }))}
        index={previewIndex ?? 0}
        onClose={() => setPreviewIndex(null)}
      />
    </Drawer>
  )
}
