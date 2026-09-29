import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { AccountNav } from '../components/AccountNav'
import { authService } from '../features/auth/authService'
import { ProfileForm } from '../features/auth/components/ProfileForm'
import type { UserDto } from '../models/user'

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
} satisfies Record<string, SxProps<Theme>>

export function ProfilePage() {
  const [user, setUser] = useState<UserDto | null>(() =>
    authService.getSession(),
  )

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user}>
      <Box data-testid="profile-page" sx={styles.root}>
        <AccountNav />
        <Box>
          <Typography variant="pageTitle" data-testid="profile-page-title">
            Profile
          </Typography>
          <Typography
            variant="pageSubtitle"
            data-testid="profile-page-subtitle"
          >
            Manage your personal information.
          </Typography>
        </Box>
        <Box sx={styles.card}>
          <ProfileForm user={user} onUpdated={setUser} />
        </Box>
      </Box>
    </AppLayout>
  )
}
