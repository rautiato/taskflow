import { useSyncExternalStore } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import {
  clearError,
  getErrorMessage,
  subscribe,
} from '../services/notifications'

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
      {/* White card with a red icon and left accent, matching the app's cards
          (Jira/Linear style), rather than a solid red bar. */}
      <Alert
        severity="error"
        variant="outlined"
        onClose={clearError}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderColor: 'divider',
          borderLeft: 4,
          borderLeftColor: 'error.main',
          borderRadius: 2,
          boxShadow: 3,
          alignItems: 'center',
          maxWidth: 480,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
