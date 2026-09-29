import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <Box
      data-testid="info-note"
      sx={{
        bgcolor: 'background.default',
        borderRadius: 2,
        p: 1.5,
        fontSize: 12,
        color: 'text.secondary',
        lineHeight: 1.5,
      }}
    >
      {children}
    </Box>
  )
}
