import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { authService } from '../../auth/authService'

import type { UserDto } from '../../../models/user'
import { UserAvatar } from '../../../components/UserAvatar'

type AccountMenuItem = {
  id: 'profile' | 'settings' | 'logout'
  label: string
  icon: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function AccountMenu({ user }: { user: UserDto }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  function handleLogout() {
    authService.signOut()
    setAnchorEl(null)
    navigate('/login')
  }

  const menuItems: AccountMenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <PersonOutlineOutlinedIcon fontSize="small" />,
      onClick: () => {
        setAnchorEl(null)
        navigate('/profile')
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsOutlinedIcon fontSize="small" />,
      onClick: () => {
        setAnchorEl(null)
        navigate('/settings')
      },
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: <LogoutIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ]

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
        <UserAvatar id={user.id} name={user.name} avatarUrl={user.avatarUrl} size="sm" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 240, mt: 1 } } }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <UserAvatar id={user.id} name={user.name} avatarUrl={user.avatarUrl} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: 'block' }}
            >
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
        {menuItems.flatMap((item) =>
          [
            item.id === 'logout' && <Divider key={`${item.id}-divider`} />,
            <MenuItem
              key={item.id}
              disabled={item.disabled}
              onClick={item.onClick}
              sx={item.id === 'logout' ? { color: 'error.main' } : undefined}
            >
              <ListItemIcon
                sx={item.id === 'logout' ? { color: 'error.main' } : undefined}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>,
          ].filter(Boolean),
        )}
      </Menu>
    </>
  )
}
