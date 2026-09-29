import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import type { UserDto } from '../../../models/user'

export function AppLayout({
  user,
  children,
}: {
  user: UserDto
  children: ReactNode
}) {
  return (
    <Box
      data-testid="app-layout"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppHeader user={user} />
      <Box
        data-testid="app-layout-content"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, md: 3.5 },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
