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
    p: 2.25,
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
  // Same height on every tile, so notes and chips line up across the row.
  footer: {
    mt: 1,
    height: 24,
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
}: {
  label: string
  value: number
  to: string
  note?: string
  accentColor?: string // colors the number and the note together
  children?: ReactNode
}) {
  const accent = accentColor ? { color: accentColor } : {}

  return (
    <Box sx={styles.root}>
      <Box component={RouterLink} to={to} sx={styles.link}>
        <Typography sx={styles.label}>{label}</Typography>
        <Typography sx={[styles.value, accent]}>{value}</Typography>
        {note && (
          <Box sx={styles.footer}>
            <Typography sx={[styles.note, accent]}>{note}</Typography>
          </Box>
        )}
      </Box>
      {children && <Box sx={styles.footer}>{children}</Box>}
    </Box>
  )
}
