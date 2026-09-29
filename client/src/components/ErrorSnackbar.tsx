import { useSyncExternalStore } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { SxProps, Theme } from '@mui/material/styles'
import {
  clearError,
  getErrorMessage,
  subscribe,
} from '../services/notifications'
import { testIdProps } from '../utils/testIdProps'

const styles = {
  alert: {
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderColor: 'divider',
    borderLeft: 4,
    borderLeftColor: 'error.main',
    borderRadius: 2,
    boxShadow: 3,
    alignItems: 'center',
    maxWidth: 480,
  },
} satisfies Record<string, SxProps<Theme>>

// App-wide toast for failures that happen after the UI has moved on (a
// dialog already closed, an optimistic update rolled back), so they're never
// silent.
export function ErrorSnackbar() {
  const message = useSyncExternalStore(subscribe, getErrorMessage)

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      onClose={(_event, reason) => {
        // Keep the message up if the user just clicked elsewhere on the page.
        if (reason !== 'clickaway') clearError()
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        severity="error"
        variant="outlined"
        onClose={clearError}
        data-testid="error-snackbar"
        slotProps={{ closeButton: testIdProps('error-snackbar-close') }}
        sx={styles.alert}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
