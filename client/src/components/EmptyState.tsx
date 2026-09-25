import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 8,
        color: 'text.secondary',
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>
      {description && (
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  )
}
