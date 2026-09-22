import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Project } from '../../../models/project'
import { formatProjectDate } from '../projectService'
import { ProjectBadge } from '../../../components/ProjectBadge'

const styles = {
  root: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    px: 2.5,
    py: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  info: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.25,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: 700,
  },
  meta: {
    fontSize: 12,
    color: 'text.secondary',
  },
  statusPill: {
    fontSize: 11,
    fontWeight: 700,
    px: 1.5,
    py: 0.5,
    borderRadius: 999,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  chevron: {
    color: 'text.secondary',
  },
} satisfies Record<string, SxProps<Theme>>

const STATUS_COLOR = {
  Active: 'success',
  'On Hold': 'warning',
} as const

export function ProjectListRow({ project }: { project: Project }) {
  const statusColor = STATUS_COLOR[project.status]

  return (
    <Box sx={[styles.root, project.status === 'On Hold' && { opacity: 0.75 }]}>
      <ProjectBadge
        initials={project.initials}
        paletteColor={project.paletteColor}
      />
      <Box sx={styles.info}>
        <Typography sx={styles.name} noWrap>
          {project.name}
        </Typography>
        <Typography sx={styles.meta} noWrap>
          {project.taskCount} tasks · Updated{' '}
          {formatProjectDate(project.updatedAt, true)}
        </Typography>
      </Box>
      <Box
        sx={[
          styles.statusPill,
          { bgcolor: `${statusColor}.light`, color: `${statusColor}.main` },
        ]}
      >
        {project.status}
      </Box>
      <ChevronRightIcon sx={styles.chevron} />
    </Box>
  )
}
