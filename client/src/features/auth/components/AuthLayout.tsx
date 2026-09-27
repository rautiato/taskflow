import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BrandPanel } from './BrandPanel'
import { Logo } from '../../../components/Logo'
import type { ReactNode } from 'react'

export function AuthLayout({
  children,
  brandPanel = true,
}: {
  children: ReactNode
  // Recovery pages (forgot/reset password) use a single column.
  brandPanel?: boolean
}) {
  return (
    <Box
      sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.paper' }}
    >
      {brandPanel && <BrandPanel />}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          // Top-aligned on phones so the form doesn't float mid-screen or
          // jump when the on-screen keyboard opens.
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          px: 3,
          pt: { xs: '10vh', md: 0 },
          pb: { xs: 4, md: 0 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          {/* With the brand panel, the logo only shows where the panel is
              hidden (below md); without it, the logo always shows. */}
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              display: brandPanel ? { xs: 'flex', md: 'none' } : 'flex',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Logo />
            <Typography sx={{ fontSize: 19, fontWeight: 700 }}>
              TaskFlow
            </Typography>
          </Stack>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
