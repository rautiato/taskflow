import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

const styles = {
  root: {
    bgcolor: 'background.default',
    borderRadius: 2,
    p: 1.5,
    fontSize: 12,
    color: 'text.secondary',
    lineHeight: 1.5,
  },
} satisfies Record<string, SxProps<Theme>>

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <Box data-testid="info-note" sx={styles.root}>
      {children}
    </Box>
  )
}
