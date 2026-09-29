import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    flex: 1,
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    p: { xs: 1.75, sm: 2.25 },
    minWidth: 0,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    '&:hover': { borderColor: 'primary.main', boxShadow: 1 },
  },
  link: {
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 30,
    fontWeight: 700,
  },
  // Same minimum height on every tile, so notes and chips line up across
  // the row; narrow tiles can still grow when the chips wrap.
  footer: {
    mt: 1,
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
  },
  note: {
    fontSize: 12,
    fontWeight: 600,
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

// A note sits inside the tile's link; `children` (e.g. the priority
// breakdown's own chip links) sits in the same footer slot outside it,
// since links can't nest.
export function StatCard({
  label,
  value,
  to,
  note,
  accentColor,
  children,
  testId,
}: {
  label: string
  value: number
  to: string
  note?: string
  accentColor?: string // colors the number and the note together
  children?: ReactNode
  testId: string
}) {
  const accent = accentColor ? { color: accentColor } : {}

  return (
    <Box sx={styles.root} data-testid={testId}>
      <Box
        component={RouterLink}
        to={to}
        sx={styles.link}
        data-testid={`${testId}-link`}
      >
        <Typography sx={styles.label} data-testid={`${testId}-label`}>
          {label}
        </Typography>
        <Typography sx={[styles.value, accent]} data-testid={`${testId}-value`}>
          {value}
        </Typography>
        {note && (
          <Box sx={styles.footer}>
            <Typography
              sx={[styles.note, accent]}
              data-testid={`${testId}-note`}
            >
              {note}
            </Typography>
          </Box>
        )}
      </Box>
      {children && <Box sx={styles.footer}>{children}</Box>}
    </Box>
  )
}
