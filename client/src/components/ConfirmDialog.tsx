import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { testIdProps } from '../utils/testIdProps'

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
      <Box
        sx={{
          p: 3.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.5,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: destructive ? 'error.light' : 'warning.light',
            color: destructive ? 'error.main' : 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberIcon />
        </Box>
        <Typography
          sx={{ fontSize: 16, fontWeight: 700 }}
          data-testid="confirm-dialog-title"
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontSize: 13, color: 'text.secondary' }}
          data-testid="confirm-dialog-description"
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.75, width: '100%' }}>
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
