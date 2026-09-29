import { Component, type ErrorInfo, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { EmptyState } from './EmptyState'

type State = { hasError: boolean }

const styles = {
  root: {
    minHeight: '100vh',
    bgcolor: 'background.default',
    display: 'grid',
    placeItems: 'center',
  },
  icon: {
    fontSize: 40,
  },
  actions: {
    display: 'flex',
    gap: 1.5,
  },
} satisfies Record<string, SxProps<Theme>>

// Catches errors thrown while rendering anywhere below it, so one crashing
// component shows a recovery screen instead of a blank page. It can't catch
// errors in event handlers or async code; failed loads and saves go to
// ErrorSnackbar via the QueryClient's error handlers instead. Still a class
// component because React has no hook equivalent for error boundaries.
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    // Both actions do a full page load, so the app starts from a clean state
    // instead of re-rendering whatever just crashed.
    return (
      <Box data-testid="error-boundary" sx={styles.root}>
        <EmptyState
          icon={<ErrorOutlineIcon sx={styles.icon} />}
          title="Something went wrong"
          description="This page hit an unexpected error. Reloading usually fixes it."
          action={
            <Box sx={styles.actions}>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                data-testid="error-boundary-reload"
              >
                Reload
              </Button>
              <Button
                variant="contained"
                onClick={() => window.location.assign('/dashboard')}
                data-testid="error-boundary-go-to-dashboard"
              >
                Go to dashboard
              </Button>
            </Box>
          }
        />
      </Box>
    )
  }
}
