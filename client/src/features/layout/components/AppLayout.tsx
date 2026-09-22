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
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppHeader user={user} />
      <Box sx={{ flexGrow: 1, px: 4, py: 3.5 }}>{children}</Box>
    </Box>
  )
}
