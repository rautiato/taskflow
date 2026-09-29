import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    minHeight: '100vh',
    bgcolor: 'background.default',
    display: 'grid',
    placeItems: 'center',
  },
} satisfies Record<string, SxProps<Theme>>

export function PageLoader() {
  return (
    <Box data-testid="page-loader" sx={styles.root}>
      <CircularProgress size={32} />
    </Box>
  )
}
