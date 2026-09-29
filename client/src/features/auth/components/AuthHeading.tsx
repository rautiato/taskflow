import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <Stack spacing={0.75} data-testid="auth-heading">
      <Typography
        variant="h5"
        sx={{ fontWeight: 700 }}
        data-testid="auth-heading-title"
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        data-testid="auth-heading-subtitle"
      >
        {subtitle}
      </Typography>
    </Stack>
  )
}
