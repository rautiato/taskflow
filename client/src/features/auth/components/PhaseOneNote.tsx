import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

export function PhaseOneNote({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        borderRadius: 2,
        p: 1.5,
        fontSize: 11,
        color: 'text.secondary',
        lineHeight: 1.5,
      }}
    >
      {children}
    </Box>
  )
}
