import { useState, type ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import { UserAvatar } from '../../../components/UserAvatar'
import { useAttachments } from '../useAttachments'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { CommentThread } from './CommentThread'
import { ImagePreviewDialog } from './ImagePreviewDialog'

function MetaRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 0 },
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
}) {
  const { attachments } = useAttachments(task?.id ?? '')
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  if (!task) return null
  const priorityStyle = PRIORITY_STYLES[task.priority]
  const dueChip = getDueChip(task, column?.isDone ?? false)

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '100vw', sm: 640 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            px: 4,
            pt: 3,
            pb: 2.5,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 16 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, pr: 5 }}>
            {task.isFavorite ? (
              <StarIcon sx={{ color: 'warning.main', fontSize: 24, mt: 0.25 }} />
            ) : (
              <StarBorderIcon
                sx={{ color: 'text.disabled', fontSize: 24, mt: 0.25 }}
              />
            )}
            <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
              {task.title}
            </Typography>
          </Box>

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
              overflow: 'hidden',
            }}
          >
            <MetaRow label="Status">
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {column?.name ?? 'Unknown'}
              </Typography>
            </MetaRow>
            <MetaRow label="Priority">
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
            </MetaRow>
            <MetaRow label="Assignee">
              <UserAvatar
                id={assignee?.id}
                name={assignee?.name ?? null}
                avatarUrl={assignee?.avatarUrl}
                size="xs"
              />
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {assignee?.name ?? 'Unassigned'}
              </Typography>
            </MetaRow>
            <MetaRow label="Created By">
              <UserAvatar
                id={creator?.id}
                name={creator?.name ?? null}
                avatarUrl={creator?.avatarUrl}
                size="xs"
              />
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                {creator?.name ?? 'Unknown'}
              </Typography>
            </MetaRow>
            <MetaRow label="Due Date">
              {dueChip ? (
                <>
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 15, color: dueChip.sx.color }}
                  />
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: dueChip.sx.color,
                    }}
                  >
                    {dueChip.label}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>
                  No due date
                </Typography>
              )}
            </MetaRow>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            px: 4,
            py: 2.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
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
            <Box
              sx={{
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.5,
                px: 2,
                py: 1.5,
              }}
            >
              <Typography
                sx={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
              >
                {task.description || 'No description provided.'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              Attachments
              {attachments.length > 0 ? ` (${attachments.length})` : ''}
            </Typography>
            {attachments.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.disabled',
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13 }}>
                  No attachments yet
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {attachments.map((a, index) => (
                  <Box
                    key={a.id}
                    component="img"
                    src={a.blobUrl}
                    alt={a.fileName}
                    onClick={() => setPreviewIndex(index)}
                    sx={{
                      width: 120,
                      height: 90,
                      borderRadius: 1,
                      objectFit: 'cover',
                      bgcolor: 'background.default',
                      cursor: 'pointer',
                    }}
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1.5,
            px: 4,
            py: 2.5,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            onClick={onDelete}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              minWidth: 140,
              bgcolor: 'error.light',
              color: 'error.main',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'error.light', boxShadow: 'none' },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={onEdit}
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ minWidth: 140 }}
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
