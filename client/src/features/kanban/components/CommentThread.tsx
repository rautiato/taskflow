import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { UserAvatar } from '../../../components/UserAvatar'
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
  const { comments, createComment, isPosting } = useComments(taskId)
  const [draft, setDraft] = useState('')

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
        return (
          <Box key={comment.id} sx={{ display: 'flex', gap: 1.25 }}>
            <UserAvatar name={author?.name ?? null} size="xs" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                  {author?.name ?? 'Unknown user'}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                  {formatTimestamp(comment.createdAt)}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
              >
                {comment.content}
              </Typography>
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
    </Box>
  )
}
