import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    py: 8,
    color: 'text.secondary',
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: 'text.primary',
  },
  action: {
    mt: 1,
  },
} satisfies Record<string, SxProps<Theme>>

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
    <Box data-testid="empty-state" sx={styles.root}>
      {icon}
      <Typography sx={styles.title} data-testid="empty-state-title">
        {title}
      </Typography>
      {description && (
        <Typography
          variant="secondaryText"
          data-testid="empty-state-description"
        >
          {description}
        </Typography>
      )}
      {action && <Box sx={styles.action}>{action}</Box>}
    </Box>
  )
}
