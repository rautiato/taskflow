import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import type { SxProps, Theme } from '@mui/material/styles'
import { Logo } from '../../../components/Logo'
import { AccountMenu } from './AccountMenu'
import { testIdProps } from '../../../utils/testIdProps'
import type { UserDto } from '../../../models/user'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'my-tasks', label: 'My Tasks', path: '/my-tasks' },
  { id: 'all-tasks', label: 'All Tasks', path: '/tasks' },
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
    px: { xs: 1, sm: 3, md: 3.5 },
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: { xs: 0.5, md: 3.5 },
    height: '100%',
  },
  // Hamburger menu below 900px: the full menu (4 links) needs a laptop-wide
  // header to fit beside the logo and avatar.
  menuButton: {
    display: { xs: 'inline-flex', md: 'none' },
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    color: 'inherit',
    textDecoration: 'none',
  },
  brandText: {
    fontSize: 19,
    fontWeight: 700,
  },
  navRow: {
    display: { xs: 'none', md: 'flex' },
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
  navLink: {
    textDecoration: 'none',
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
    pr: { xs: 1, sm: 0 },
  },
  drawerList: {
    width: 240,
    pt: 1,
  },
} satisfies Record<string, SxProps<Theme>>

export function AppHeader({ user }: { user: UserDto }) {
  const location = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)
  // Prefix match so a section stays active on its sub-pages
  // (e.g. Projects on /projects/:id/board).
  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <Box sx={styles.root} data-testid="app-header">
      <Box sx={styles.brandGroup}>
        <IconButton
          aria-label="Open navigation"
          onClick={() => setIsNavOpen(true)}
          sx={styles.menuButton}
          data-testid="app-header-menu-button"
        >
          <MenuIcon />
        </IconButton>
        <Box
          component={RouterLink}
          to="/dashboard"
          aria-label="TaskFlow home"
          sx={styles.brandRow}
          data-testid="app-header-home"
        >
          <Logo />
          <Typography sx={styles.brandText}>TaskFlow</Typography>
        </Box>
        <Box sx={styles.navRow} data-testid="app-header-nav">
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.label}
              component={RouterLink}
              to={item.path}
              data-testid={`app-header-nav-${item.id}`}
              sx={[
                styles.navItem,
                styles.navLink,
                isActive(item.path) && styles.navItemActive,
              ]}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={styles.actionsGroup}>
        <AccountMenu user={user} />
      </Box>

      {/* Phone navigation; the inline nav row is hidden below sm. */}
      <Drawer
        open={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        slotProps={{ paper: testIdProps('app-header-drawer') }}
      >
        <List component="nav" aria-label="Main" sx={styles.drawerList}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.path}
              selected={isActive(item.path)}
              onClick={() => setIsNavOpen(false)}
              data-testid={`app-header-drawer-${item.id}`}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  )
}
