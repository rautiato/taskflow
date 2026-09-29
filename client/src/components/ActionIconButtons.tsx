import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  editIcon: {
    fontSize: 18,
    color: 'primary.main',
  },
  deleteIcon: {
    fontSize: 18,
    color: 'error.main',
  },
} satisfies Record<string, SxProps<Theme>>

// Small pencil / bin buttons for row and card actions. Callers pass their
// own label, click handler, padding and test id.
export function EditIconButton(props: IconButtonProps) {
  return (
    <IconButton size="small" {...props}>
      <EditIcon sx={styles.editIcon} />
    </IconButton>
  )
}

export function DeleteIconButton(props: IconButtonProps) {
  return (
    <IconButton size="small" {...props}>
      <DeleteIcon sx={styles.deleteIcon} />
    </IconButton>
  )
}
