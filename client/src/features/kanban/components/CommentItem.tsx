import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import { UserAvatar } from '../../../components/UserAvatar'
import {
  DeleteIconButton,
  EditIconButton,
} from '../../../components/ActionIconButtons'
import type { Comment } from '../../../models/comment'
import type { UserDto } from '../../../models/user'
import { formatRelativeTime } from '../../../utils/formatRelativeTime'
import { testIdProps } from '../../../utils/testIdProps'
import { MAX_COMMENT_LENGTH } from '../commentService'

const styles = {
  root: {
    display: 'flex',
    gap: 1.25,
    '&:hover .comment-actions': { opacity: 1 },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.25,
    flexGrow: 1,
    minWidth: 0,
  },
  meta: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 0.75,
  },
  author: {
    fontSize: 13,
    fontWeight: 700,
  },
  time: {
    fontSize: 11,
    color: 'text.secondary',
  },
  edited: {
    fontSize: 11,
    color: 'text.disabled',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    gap: 0.25,
    ml: 'auto',
    opacity: 0,
    transition: 'opacity 0.15s ease',
    // Touch screens can't hover, so keep the actions visible.
    '@media (hover: none)': { opacity: 1 },
  },
  actionButton: {
    p: 0.5,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  },
  editButtons: {
    display: 'flex',
    gap: 1,
  },
  content: {
    fontSize: 13,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
} satisfies Record<string, SxProps<Theme>>

// Mounted only while editing, so the draft starts from the saved content
// each time editing begins.
function CommentEditForm({
  initialContent,
  onSave,
  onCancel,
}: {
  initialContent: string
  onSave: (content: string) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(initialContent)
  const isTooLong = draft.length > MAX_COMMENT_LENGTH

  function handleSave() {
    const content = draft.trim()
    if (!content || isTooLong) return
    onSave(content)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSave()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }

  return (
    <Box sx={styles.editForm}>
      <TextField
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        size="small"
        fullWidth
        multiline
        minRows={1}
        maxRows={10}
        autoFocus
        error={isTooLong}
        slotProps={{
          htmlInput: testIdProps('comment-thread-item-edit-input'),
        }}
      />
      <Box sx={styles.editButtons}>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          data-testid="comment-thread-item-save"
          disabled={!draft.trim() || isTooLong}
        >
          Save
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
          data-testid="comment-thread-item-cancel"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

export function CommentItem({
  comment,
  author,
  canModify,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  comment: Comment
  author: UserDto | undefined
  canModify: boolean
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: (content: string) => void
  onDelete: () => void
}) {
  return (
    <Box data-testid="comment-thread-item" sx={styles.root}>
      <UserAvatar
        id={author?.id}
        name={author?.name ?? null}
        avatarUrl={author?.avatarUrl}
        size="xs"
      />
      <Box sx={styles.body}>
        <Box sx={styles.meta}>
          <Typography
            sx={styles.author}
            data-testid="comment-thread-item-author"
          >
            {author?.name ?? 'Unknown user'}
          </Typography>
          <Typography sx={styles.time} data-testid="comment-thread-item-time">
            {formatRelativeTime(comment.updatedAt ?? comment.createdAt)}
          </Typography>
          {comment.updatedAt && (
            <Typography
              sx={styles.edited}
              data-testid="comment-thread-item-edited"
            >
              (edited)
            </Typography>
          )}
          {canModify && !isEditing && (
            <Box className="comment-actions" sx={styles.actions}>
              <EditIconButton
                aria-label="Edit comment"
                onClick={onStartEdit}
                sx={styles.actionButton}
                data-testid="comment-thread-item-edit"
              />
              <DeleteIconButton
                aria-label="Delete comment"
                onClick={onDelete}
                sx={styles.actionButton}
                data-testid="comment-thread-item-delete"
              />
            </Box>
          )}
        </Box>
        {isEditing ? (
          <CommentEditForm
            initialContent={comment.content}
            onSave={onSave}
            onCancel={onCancelEdit}
          />
        ) : (
          <Typography
            sx={styles.content}
            data-testid="comment-thread-item-content"
          >
            {comment.content}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
