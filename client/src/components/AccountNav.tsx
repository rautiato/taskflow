import Box from '@mui/material/Box'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import type { SxProps, Theme } from '@mui/material/styles'

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'settings', label: 'Settings', path: '/settings' },
] as const

const styles = {
  root: {
    display: 'flex',
    gap: 0.75,
    mb: 2.5,
  },
  item: {
    px: 1.75,
    py: 0.625,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: 'text.secondary',
    textDecoration: 'none',
  },
  itemActive: {
    bgcolor: 'primary.main',
    color: '#FFFFFF',
  },
} satisfies Record<string, SxProps<Theme>>

export function AccountNav() {
  const location = useLocation()

  return (
    <Box sx={styles.root} data-testid="account-nav">
      {NAV_ITEMS.map((item) => (
        <Box
          key={item.path}
          component={RouterLink}
          to={item.path}
          data-testid={`account-nav-${item.id}`}
          sx={[
            styles.item,
            item.path === location.pathname && styles.itemActive,
          ]}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  )
}
