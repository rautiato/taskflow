import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import { testIdProps } from '../../../utils/testIdProps'
import { MAX_COMMENT_LENGTH } from '../commentLimits'

const COUNTER_WARNING_THRESHOLD = MAX_COMMENT_LENGTH - 500

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },
  row: {
    display: 'flex',
    gap: 1,
    alignItems: 'flex-end',
  },
  counter: {
    fontSize: 11,
    color: 'text.secondary',
    alignSelf: 'flex-end',
  },
  counterTooLong: {
    color: 'error.main',
  },
} satisfies Record<string, SxProps<Theme>>

export function CommentComposer({
  isPosting,
  onPost,
}: {
  isPosting: boolean
  onPost: (content: string) => void
}) {
  const [draft, setDraft] = useState('')
  const isTooLong = draft.length > MAX_COMMENT_LENGTH
  const showCounter = draft.length > COUNTER_WARNING_THRESHOLD

  function handleSubmit() {
    const content = draft.trim()
    if (!content || isTooLong) return
    onPost(content)
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Box sx={styles.root}>
      <Box sx={styles.row}>
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
          slotProps={{ htmlInput: testIdProps('comment-thread-input') }}
        />
        <Button
          onClick={handleSubmit}
          disabled={!draft.trim() || isTooLong || isPosting}
          variant="contained"
          data-testid="comment-thread-post"
        >
          Post
        </Button>
      </Box>
      {showCounter && (
        <Typography
          sx={[styles.counter, isTooLong && styles.counterTooLong]}
          data-testid="comment-thread-counter"
        >
          {draft.length} / {MAX_COMMENT_LENGTH}
        </Typography>
      )}
    </Box>
  )
}
