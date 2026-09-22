import { Box } from '@mui/material'
import type { ReactNode } from 'react'

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        px: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 380 }}>{children}</Box>
    </Box>
  )
}
