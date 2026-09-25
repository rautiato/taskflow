import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { UserAvatar } from '../../../components/UserAvatar'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { useComments } from '../useComments'
import type { UserDto } from '../../../models/user'

const MAX_COMMENT_LENGTH = 32_767
const COUNTER_WARNING_THRESHOLD = MAX_COMMENT_LENGTH - 500

function formatTimestamp(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.round(diffMs / 60_000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function CommentThread({
  taskId,
  users,
  currentUser,
}: {
  taskId: string
  users: UserDto[]
  currentUser: UserDto
}) {
  const { comments, createComment, isPosting, updateComment, deleteComment } =
    useComments(taskId)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const trimmedLength = draft.trim().length
  const isTooLong = draft.length > MAX_COMMENT_LENGTH
  const showCounter = draft.length > COUNTER_WARNING_THRESHOLD

  function handleSubmit() {
    const content = draft.trim()
    if (!content || content.length > MAX_COMMENT_LENGTH) return
    createComment({ taskId, userId: currentUser.id, content })
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }

  function startEdit(commentId: string, content: string) {
    setEditingId(commentId)
    setEditDraft(content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditDraft('')
  }

  function submitEdit(commentId: string) {
    const content = editDraft.trim()
    if (!content || content.length > MAX_COMMENT_LENGTH) return
    updateComment({ id: commentId, content })
    cancelEdit()
  }

  function handleEditKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    commentId: string,
  ) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      submitEdit(commentId)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelEdit()
    }
  }

  function handleConfirmDelete() {
    if (!deleteTargetId) return
    deleteComment(deleteTargetId)
    setDeleteTargetId(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
        }}
      >
        Comments ({comments.length})
      </Typography>

      {comments.map((comment) => {
        const author = users.find((u) => u.id === comment.userId)
        const isOwnComment = comment.userId === currentUser.id
        const isEditing = editingId === comment.id

        return (
          <Box
            key={comment.id}
            sx={{
              display: 'flex',
              gap: 1.25,
              '&:hover .comment-actions': { opacity: 1 },
            }}
          >
            <UserAvatar
              id={author?.id}
              name={author?.name ?? null}
              avatarUrl={author?.avatarUrl}
              size="xs"
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  {author?.name ?? 'Unknown user'}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                  {formatTimestamp(comment.updatedAt ?? comment.createdAt)}
                </Typography>
                {comment.updatedAt && (
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: 'text.disabled',
                      fontStyle: 'italic',
                    }}
                  >
                    (edited)
                  </Typography>
                )}
                {isOwnComment && !isEditing && (
                  <Box
                    className="comment-actions"
                    sx={{
                      display: 'flex',
                      gap: 0.25,
                      ml: 'auto',
                      opacity: 0,
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => startEdit(comment.id, comment.content)}
                      sx={{ p: 0.5 }}
                    >
                      <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteTargetId(comment.id)}
                      sx={{ p: 0.5 }}
                    >
                      <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
              {isEditing ? (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}
                >
                  <TextField
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, comment.id)}
                    size="small"
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={10}
                    autoFocus
                    error={editDraft.length > MAX_COMMENT_LENGTH}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => submitEdit(comment.id)}
                      disabled={
                        !editDraft.trim() ||
                        editDraft.length > MAX_COMMENT_LENGTH
                      }
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Typography
                  sx={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
                >
                  {comment.content}
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment… (Ctrl+Enter to post)"
            size="small"
            fullWidth
            multiline
            minRows={1}
            maxRows={10}
            error={isTooLong}
          />
          <Button
            onClick={handleSubmit}
            disabled={!trimmedLength || isTooLong || isPosting}
            variant="contained"
          >
            Post
          </Button>
        </Box>
        {showCounter && (
          <Typography
            sx={{
              fontSize: 11,
              color: isTooLong ? 'error.main' : 'text.secondary',
              alignSelf: 'flex-end',
            }}
          >
            {draft.length} / {MAX_COMMENT_LENGTH}
          </Typography>
        )}
      </Box>

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="Delete this comment?"
        description="This action can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </Box>
  )
}
