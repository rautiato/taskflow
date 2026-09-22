import Box from '@mui/material/Box'
import { BrandPanel } from './BrandPanel'
import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}
    >
      <BrandPanel />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>{children}</Box>
      </Box>
    </Box>
  )
}
