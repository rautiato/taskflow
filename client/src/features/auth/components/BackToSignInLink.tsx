import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export function BackToSignInLink() {
  return (
    <Link
      component={RouterLink}
      to="/login"
      color="text.secondary"
      sx={{ display: 'inline-flex' }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <ArrowBackIcon sx={{ fontSize: 15 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Back to sign in
        </Typography>
      </Stack>
    </Link>
  )
}
