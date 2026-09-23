import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ProjectPaletteColor } from '../../../models/project'
import { ProjectBadge } from '../../../components/ProjectBadge'

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

export function ProjectCard({
  name,
  initials,
  tasks,
  updated,
  progress,
  paletteColor,
  onClick,
}: {
  name: string
  initials: string
  tasks: number
  updated: string
  progress: number
  paletteColor: ProjectPaletteColor
  onClick?: () => void
}) {
  return (
    <Box onClick={onClick} sx={[styles.root, { cursor: 'pointer' }]}>
      <Box sx={styles.header}>
        <ProjectBadge
          initials={initials}
          paletteColor={paletteColor}
          size="sm"
        />
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
