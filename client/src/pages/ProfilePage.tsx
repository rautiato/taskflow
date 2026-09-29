import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Navigate } from 'react-router-dom'
import { AppLayout } from '../features/layout/components/AppLayout'
import { AccountNav } from '../components/AccountNav'
import { authService } from '../features/auth/authService'
import { ProfileForm } from '../features/auth/components/ProfileForm'
import type { UserDto } from '../models/user'

export function ProfilePage() {
  const [user, setUser] = useState<UserDto | null>(() =>
    authService.getSession(),
  )

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout user={user}>
      <Box
        data-testid="profile-page"
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
          <Typography
            sx={{ fontSize: 24, fontWeight: 700 }}
            data-testid="profile-page-title"
          >
            Profile
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: 'text.secondary' }}
            data-testid="profile-page-subtitle"
          >
            Manage your personal information.
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
          }}
        >
          <ProfileForm user={user} onUpdated={setUser} />
        </Box>
      </Box>
    </AppLayout>
  )
}
