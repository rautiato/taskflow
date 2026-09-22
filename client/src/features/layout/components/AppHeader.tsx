import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import type { SxProps, Theme } from '@mui/material/styles'
import { Logo } from '../../../components/Logo'
import { AccountMenu } from './AccountMenu'
import type { UserDto } from '../../../models/user'

const NAV_ITEMS = [
  { label: 'Dashboard', active: true },
  { label: 'Projects', active: false },
  { label: 'My Tasks', active: false },
] as const

const styles = {
  root: {
    height: 64,
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 3.5,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 3.5,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
  },
  brandText: {
    fontSize: 19,
    fontWeight: 700,
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 2.75,
    height: '100%',
  },
  navItem: {
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: 'text.secondary',
    borderBottom: 2,
    borderColor: 'transparent',
  },
  navItemActive: {
    fontWeight: 700,
    color: 'primary.main',
    borderColor: 'primary.main',
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 2.25,
  },
  searchBox: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    px: 1.5,
    py: 0.875,
    width: 220,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: 'text.secondary',
  },
  searchIcon: {
    fontSize: 15,
  },
  searchLabel: {
    fontSize: 13,
  },
} satisfies Record<string, SxProps<Theme>>

export function AppHeader({ user }: { user: UserDto }) {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.brandGroup}>
        <Box sx={styles.brandRow}>
          <Logo />
          <Typography sx={styles.brandText}>TaskFlow</Typography>
        </Box>
        <Box sx={styles.navRow}>
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.label}
              sx={[styles.navItem, item.active && styles.navItemActive]}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={styles.actionsGroup}>
        <Box sx={styles.searchBox}>
          <SearchIcon sx={styles.searchIcon} />
          <Typography sx={styles.searchLabel}>
            Search tasks, projects...
          </Typography>
        </Box>
        <AccountMenu user={user} />
      </Box>
    </Box>
  )
}
