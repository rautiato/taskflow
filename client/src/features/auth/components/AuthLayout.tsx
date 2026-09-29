import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import { BrandPanel } from './BrandPanel'
import { Logo } from '../../../components/Logo'
import type { ReactNode } from 'react'

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    bgcolor: 'background.paper',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    alignItems: { xs: 'flex-start', md: 'center' },
    justifyContent: 'center',
    px: 3,
    pt: { xs: '10vh', md: 0 },
    pb: { xs: 4, md: 0 },
  },
  content: {
    width: '100%',
    maxWidth: 380,
  },
  brandRow: {
    alignItems: 'center',
    mb: 4,
  },
  // The brand panel already shows the logo on desktop.
  brandRowMobileOnly: {
    display: { xs: 'flex', md: 'none' },
  },
  brandText: {
    fontSize: 19,
    fontWeight: 700,
  },
} satisfies Record<string, SxProps<Theme>>

export function AuthLayout({
  children,
  brandPanel = true,
}: {
  children: ReactNode
  brandPanel?: boolean
}) {
  return (
    <Box sx={styles.root} data-testid="auth-layout">
      {brandPanel && <BrandPanel />}
      <Box sx={styles.main}>
        <Box sx={styles.content}>
          <Stack
            direction="row"
            spacing={1.25}
            sx={[styles.brandRow, brandPanel && styles.brandRowMobileOnly]}
            data-testid="auth-layout-brand"
          >
            <Logo />
            <Typography sx={styles.brandText}>TaskFlow</Typography>
          </Stack>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
