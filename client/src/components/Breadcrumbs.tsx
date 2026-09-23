import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

const crumbSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <MuiBreadcrumbs
      separator="/"
      sx={{
        ...crumbSx,
        color: 'text.secondary',
        mb: 0.5,
        '& .MuiBreadcrumbs-separator': { mx: 0.75 },
      }}
    >
      {items.map((item, index) =>
        item.to && index < items.length - 1 ? (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            underline="hover"
            color="text.secondary"
            sx={crumbSx}
          >
            {item.label}
          </Link>
        ) : (
          <Typography
            key={item.label}
            sx={{ ...crumbSx, color: 'text.secondary' }}
          >
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  )
}
