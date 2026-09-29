import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import type { SxProps, Theme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const styles = {
  link: {
    display: 'inline-flex',
  },
  row: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 15,
  },
  label: {
    fontWeight: 600,
  },
} satisfies Record<string, SxProps<Theme>>

export function BackToSignInLink() {
  return (
    <Link
      component={RouterLink}
      to="/login"
      color="text.secondary"
      sx={styles.link}
      data-testid="back-to-sign-in-link"
    >
      <Stack direction="row" spacing={1} sx={styles.row}>
        <ArrowBackIcon sx={styles.icon} />
        <Typography variant="body2" sx={styles.label}>
          Back to sign in
        </Typography>
      </Stack>
    </Link>
  )
}
