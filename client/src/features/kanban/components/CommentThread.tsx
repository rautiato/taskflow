import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { useComments } from '../useComments'
import type { UserDto } from '../../../models/user'
import { CommentItem } from './CommentItem'
import { CommentComposer } from './CommentComposer'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
} satisfies Record<string, SxProps<Theme>>

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
  // One comment at a time: starting another edit drops the current one.
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  function handleConfirmDelete() {
    if (!deleteTargetId) return
    deleteComment(deleteTargetId)
    setDeleteTargetId(null)
  }

  return (
    <Box sx={styles.root} data-testid="comment-thread">
      <Typography variant="sectionLabel" data-testid="comment-thread-heading">
        Comments ({comments.length})
      </Typography>

      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          author={users.find((u) => u.id === comment.userId)}
          canModify={comment.userId === currentUser.id}
          isEditing={editingId === comment.id}
          onStartEdit={() => setEditingId(comment.id)}
          onCancelEdit={() => setEditingId(null)}
          onSave={(content) => {
            updateComment({ id: comment.id, content })
            setEditingId(null)
          }}
          onDelete={() => setDeleteTargetId(comment.id)}
        />
      ))}

      <CommentComposer
        isPosting={isPosting}
        onPost={(content) =>
          createComment({ taskId, userId: currentUser.id, content })
        }
      />

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
