import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { testIdProps } from '../utils/testIdProps'

const styles = {
  root: {
    p: 3.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1.5,
    textAlign: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    bgcolor: 'warning.light',
    color: 'warning.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDestructive: {
    bgcolor: 'error.light',
    color: 'error.main',
  },
  actions: {
    display: 'flex',
    gap: 1.5,
    mt: 0.75,
    width: '100%',
  },
} satisfies Record<string, SxProps<Theme>>

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: testIdProps('confirm-dialog') }}
    >
      <Box sx={styles.root}>
        <Box sx={[styles.icon, destructive && styles.iconDestructive]}>
          <WarningAmberIcon />
        </Box>
        <Typography variant="sectionTitle" data-testid="confirm-dialog-title">
          {title}
        </Typography>
        <Typography
          variant="secondaryText"
          data-testid="confirm-dialog-description"
        >
          {description}
        </Typography>
        <Box sx={styles.actions}>
          <Button
            onClick={onCancel}
            variant="outlined"
            fullWidth
            data-testid="confirm-dialog-cancel"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color={destructive ? 'error' : 'primary'}
            fullWidth
            data-testid="confirm-dialog-confirm"
          >
            {confirmLabel}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
