import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import type { SxProps, Theme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

const styles = {
  crumb: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  root: {
    color: 'text.secondary',
    mb: 0.5,
    '& .MuiBreadcrumbs-separator': { mx: 0.75 },
  },
  current: {
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <MuiBreadcrumbs
      separator="/"
      data-testid="breadcrumbs"
      sx={[styles.crumb, styles.root]}
    >
      {items.map((item, index) =>
        item.to && index < items.length - 1 ? (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            color="text.secondary"
            sx={styles.crumb}
            data-testid="breadcrumbs-item"
          >
            {item.label}
          </Link>
        ) : (
          <Typography
            key={item.label}
            sx={[styles.crumb, styles.current]}
            data-testid="breadcrumbs-item"
          >
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  )
}
