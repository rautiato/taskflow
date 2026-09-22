import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    flex: 1,
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    p: 2.25,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 700,
  },
  meta: {
    fontSize: 11,
    color: 'text.secondary',
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    bgcolor: '#EEF0F2',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

type PaletteColor = 'error' | 'primary' | 'success'

export function ProjectCard({
  name,
  initials,
  tasks,
  updated,
  progress,
  paletteColor,
}: {
  name: string
  initials: string
  tasks: number
  updated: string
  progress: number
  paletteColor: PaletteColor
}) {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Box
          sx={[
            styles.badge,
            {
              bgcolor: `${paletteColor}.light`,
              color: `${paletteColor}.main`,
            },
          ]}
        >
          {initials}
        </Box>
        <Box>
          <Typography sx={styles.name}>{name}</Typography>
          <Typography sx={styles.meta}>
            {tasks} tasks · Updated {updated}
          </Typography>
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={[
          styles.progressTrack,
          { '& .MuiLinearProgress-bar': { bgcolor: `${paletteColor}.main` } },
        ]}
      />
      <Typography sx={styles.progressLabel}>{progress}% complete</Typography>
    </Box>
  )
}
