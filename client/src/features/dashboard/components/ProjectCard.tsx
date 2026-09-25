import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ProjectPaletteColor, ProjectStats } from '../../../models/project'
import { ProjectBadge } from '../../../components/ProjectBadge'

// Segment colors double as the legend dots on the "Team" line below.
const SEGMENT_COLORS = {
  done: 'success.main',
  open: 'grey.400',
  overdue: 'error.main',
} as const

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
    cursor: 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    '&:hover': { borderColor: 'primary.main', boxShadow: 1 },
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
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
  },
  bar: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    display: 'flex',
    bgcolor: 'grey.200',
  },
  percent: {
    fontSize: 12,
    fontWeight: 700,
    minWidth: 34,
    textAlign: 'right',
  },
  statsLine: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 1.25,
    rowGap: 0.5,
    fontSize: 12,
    fontWeight: 600,
    color: 'text.secondary',
  },
  lineLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: 'text.secondary',
    minWidth: 40,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
} satisfies Record<string, SxProps<Theme>>

// Team-wide health of one project (everyone's tasks, including unassigned),
// plus the signed-in user's own open count on a separate "You" line.
export function ProjectCard({
  name,
  initials,
  paletteColor,
  updated,
  stats,
  myOpenCount,
  onClick,
}: {
  name: string
  initials: string
  paletteColor: ProjectPaletteColor
  updated: string
  stats: ProjectStats
  myOpenCount: number
  onClick?: () => void
}) {
  const { taskCount, completedCount, overdueCount, unassignedCount } = stats
  // Done + open + overdue always sum to taskCount, so the bar is exact.
  const openCount = taskCount - completedCount - overdueCount
  const segments = [
    { key: 'done', count: completedCount, color: SEGMENT_COLORS.done },
    { key: 'open', count: openCount, color: SEGMENT_COLORS.open },
    { key: 'overdue', count: overdueCount, color: SEGMENT_COLORS.overdue },
  ]

  return (
    <Box onClick={onClick} sx={styles.root}>
      <Box sx={styles.header}>
        <ProjectBadge
          initials={initials}
          paletteColor={paletteColor}
          size="sm"
        />
        <Box>
          <Typography sx={styles.name}>{name}</Typography>
          <Typography sx={styles.meta}>Updated {updated}</Typography>
        </Box>
      </Box>

      {taskCount === 0 ? (
        // A project with no tasks isn't 0% behind — say so instead.
        <Typography sx={styles.statsLine}>No tasks yet</Typography>
      ) : (
        <>
          <Box sx={styles.barRow}>
            <Box
              sx={styles.bar}
              role="img"
              aria-label={`${completedCount} done, ${openCount} open, ${overdueCount} overdue`}
            >
              {segments.map(
                (segment) =>
                  segment.count > 0 && (
                    <Box
                      key={segment.key}
                      sx={{
                        width: `${(segment.count / taskCount) * 100}%`,
                        bgcolor: segment.color,
                      }}
                    />
                  ),
              )}
            </Box>
            <Typography sx={styles.percent}>{stats.progress}%</Typography>
          </Box>

          <Box sx={styles.statsLine}>
            <Typography component="span" sx={styles.lineLabel}>
              Team
            </Typography>
            {segments.map((segment) => (
              <Box key={segment.key} sx={styles.legendItem}>
                <Box sx={[styles.dot, { bgcolor: segment.color }]} />
                <Box
                  component="span"
                  sx={
                    segment.key === 'overdue' && segment.count > 0
                      ? { color: 'error.main' }
                      : {}
                  }
                >
                  {segment.count} {segment.key}
                </Box>
              </Box>
            ))}
            <Box
              component="span"
              sx={unassignedCount > 0 ? { color: 'warning.main' } : {}}
            >
              · {unassignedCount} unassigned
            </Box>
          </Box>
        </>
      )}

      <Box sx={styles.statsLine}>
        <Typography component="span" sx={styles.lineLabel}>
          You
        </Typography>
        <Box component="span">{myOpenCount} open</Box>
      </Box>
    </Box>
  )
}
