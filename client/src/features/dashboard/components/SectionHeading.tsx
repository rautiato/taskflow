import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    mb: 1.75,
  },
  subtitle: {
    fontSize: 12,
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

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
    <Box sx={styles.root} data-testid="section-heading">
      <Typography variant="sectionTitle" data-testid="section-heading-title">
        {title}
      </Typography>
      <Typography sx={styles.subtitle} data-testid="section-heading-subtitle">
        {subtitle}
      </Typography>
    </Box>
  )
}
