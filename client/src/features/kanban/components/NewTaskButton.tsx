import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'

const styles = {
  button: {
    flexShrink: 0,
  },
} satisfies Record<string, SxProps<Theme>>

export function NewTaskButton({
  onClick,
  sx,
}: {
  onClick: () => void
  sx?: SxProps<Theme>
}) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={[styles.button, ...(Array.isArray(sx) ? sx : [sx])]}
      data-testid="new-task-button"
    >
      New Task
    </Button>
  )
}
