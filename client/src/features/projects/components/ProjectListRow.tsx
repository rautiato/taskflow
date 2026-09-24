import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
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

export function ProjectListRow({
  project,
  onClick,
  onToggleStatus,
}: {
  project: Project
  onClick?: () => void
  onToggleStatus?: () => void
}) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const isClosed = project.status === 'Closed'

  return (
    <Box
      onClick={() => {
        // A backdrop click closing the menu still bubbles here (portals
        // bubble through the React tree, not the DOM tree) — this closure
        // still sees the pre-close anchor since setMenuAnchor(null) hasn't
        // flushed yet within the same event dispatch, so skip navigating.
        if (menuAnchor) return
        onClick?.()
      }}
      sx={[styles.root, { cursor: 'pointer' }, isClosed && { opacity: 0.75 }]}
    >
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
          isClosed
            ? { bgcolor: 'action.selected', color: 'text.secondary' }
            : { bgcolor: 'success.light', color: 'success.main' },
        ]}
      >
        {project.status}
      </Box>
      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation()
          setMenuAnchor(event.currentTarget)
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            onToggleStatus?.()
            setMenuAnchor(null)
          }}
        >
          {isClosed ? 'Mark as Active' : 'Mark as Closed'}
        </MenuItem>
      </Menu>
      <ChevronRightIcon sx={styles.chevron} />
    </Box>
  )
}
