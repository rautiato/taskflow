import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { AccountNav } from '../components/AccountNav'
import { authService } from '../features/auth/authService'
import { ChangePasswordForm } from '../features/auth/components/ChangePasswordForm'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
    maxWidth: 560,
    mx: 'auto',
  },
  card: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    p: { xs: 2, sm: 3 },
  },
  cardTitle: {
    mb: 2,
  },
} satisfies Record<string, SxProps<Theme>>

export function SettingsPage() {
  const user = authService.getSession()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user}>
      <Box data-testid="settings-page" sx={styles.root}>
        <AccountNav />
        <Box>
          <Typography variant="pageTitle" data-testid="settings-page-title">
            Settings
          </Typography>
          <Typography
            variant="pageSubtitle"
            data-testid="settings-page-subtitle"
          >
            Manage your account security.
          </Typography>
        </Box>
        <Box sx={styles.card}>
          <Typography
            variant="sectionTitle"
            sx={styles.cardTitle}
            data-testid="settings-page-change-password-title"
          >
            Change Password
          </Typography>
          <ChangePasswordForm userId={user.id} />
        </Box>
      </Box>
    </AppLayout>
  )
}
