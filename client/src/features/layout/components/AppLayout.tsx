import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { AppHeader } from './AppHeader'
import type { UserDto } from '../../../models/user'

const styles = {
  root: {
    minHeight: '100vh',
    bgcolor: 'background.default',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 2.5, md: 3.5 },
  },
} satisfies Record<string, SxProps<Theme>>

export function AppLayout({
  user,
  children,
}: {
  user: UserDto
  children: ReactNode
}) {
  return (
    <Box data-testid="app-layout" sx={styles.root}>
      <AppHeader user={user} />
      <Box data-testid="app-layout-content" sx={styles.content}>
        {children}
      </Box>
    </Box>
  )
}
