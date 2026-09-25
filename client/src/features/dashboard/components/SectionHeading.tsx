import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Title + one-line rule for a dashboard section, so each section says
// whose tasks it counts.
export function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{title}</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
        {subtitle}
      </Typography>
    </Box>
  )
}
