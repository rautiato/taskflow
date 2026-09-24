import { useState } from 'react'
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

export function TaskDetailDrawer({
  open,
  task,
  column,
  assignee,
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
          width: 400,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {task.isFavorite ? (
              <StarIcon sx={{ color: 'warning.main', fontSize: 22 }} />
            ) : (
              <StarBorderIcon sx={{ color: 'text.disabled', fontSize: 22 }} />
            )}
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
              {task.title}
            </Typography>
          </Box>

          {dueChip && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 15, color: dueChip.sx.color }}
              />
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: dueChip.sx.color }}
              >
                {dueChip.label}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserAvatar name={assignee?.name ?? null} size="xs" />
            <Typography sx={{ fontSize: 13 }}>
              {assignee ? (
                <>
                  Assigned to{' '}
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    {assignee.name}
                  </Box>
                </>
              ) : (
                'Unassigned'
              )}
            </Typography>
          </Box>

          <Divider />

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
              <Box sx={{ display: 'flex', gap: 1 }}>
                {attachments.map((a, index) => (
                  <Box
                    key={a.id}
                    component="img"
                    src={a.blobUrl}
                    alt={a.fileName}
                    onClick={() => setPreviewIndex(index)}
                    sx={{
                      width: 100,
                      height: 76,
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
            variant="contained"
            startIcon={<DeleteIcon />}
            fullWidth
            sx={{
              bgcolor: 'error.light',
              color: 'error.main',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'error.light', boxShadow: 'none' },
            }}
          >
            Delete
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
