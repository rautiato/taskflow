import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

export function PageLoader() {
  return (
    <Box
      data-testid="page-loader"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <CircularProgress size={32} />
    </Box>
  )
}
