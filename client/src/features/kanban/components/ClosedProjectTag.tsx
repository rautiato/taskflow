import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    fontSize: 10,
    fontWeight: 700,
    px: 0.75,
    py: 0.125,
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    bgcolor: 'action.selected',
    color: 'text.secondary',
    flexShrink: 0,
  },
} satisfies Record<string, SxProps<Theme>>

// Marks a task whose project is closed — same look as the Closed pill on
// the Projects page.
export function ClosedProjectTag() {
  return (
    <Box component="span" sx={styles.root} data-testid="closed-project-tag">
      Closed
    </Box>
  )
}
