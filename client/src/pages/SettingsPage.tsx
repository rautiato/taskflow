import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { AccountNav } from '../components/AccountNav'
import { authService } from '../features/auth/authService'
import { ChangePasswordForm } from '../features/auth/components/ChangePasswordForm'

export function SettingsPage() {
  const user = authService.getSession()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          maxWidth: 560,
          mx: 'auto',
        }}
      >
        <AccountNav />
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
            Manage your account security.
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>
            Change Password
          </Typography>
          <ChangePasswordForm userId={user.id} />
        </Box>
      </Box>
    </AppLayout>
  )
}
