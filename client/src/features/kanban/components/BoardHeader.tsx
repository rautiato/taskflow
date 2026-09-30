import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import type { SxProps, Theme } from '@mui/material/styles'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import { Breadcrumbs } from '../../../components/Breadcrumbs'
import { ClosedProjectTag } from './ClosedProjectTag'

export type BoardView = 'kanban' | 'list'

const styles = {
  // Phones: title on its own row, controls on the next.
  root: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'flex-end' },
    justifyContent: 'space-between',
    gap: 1.5,
  },
  titleBlock: {
    minWidth: 0,
  },
  // Same Closed tag as the task lists, so a closed project reads the same
  // everywhere.
  titleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 1.25,
    rowGap: 0.5,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: { xs: 1, sm: 2 },
    flexShrink: 0,
  },
  viewToggle: {
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      fontWeight: 600,
      color: 'text.secondary',
      borderColor: 'divider',
      px: 1.5,
      '&.Mui-selected': {
        bgcolor: 'primary.main',
        color: 'common.white',
        '&:hover': { bgcolor: 'primary.dark' },
      },
    },
  },
  viewIcon: {
    fontSize: 16,
    mr: { xs: 0, sm: 0.75 },
  },
  // Icon-only on phones; aria-label keeps the name.
  viewLabel: {
    display: { xs: 'none', sm: 'inline' },
  },
} satisfies Record<string, SxProps<Theme>>

export function BoardHeader({
  projectName,
  isProjectClosed = false,
  taskCount,
  view,
  onViewChange,
  actions,
}: {
  projectName: string
  isProjectClosed?: boolean
  taskCount: number
  view: BoardView
  onViewChange: (view: BoardView) => void
  // Shown after the view toggle: the view's own action (Manage Columns on
  // the Kanban view, New Task on the List view on phones).
  actions?: ReactNode
}) {
  return (
    <Box data-testid="board-header" sx={styles.root}>
      <Box sx={styles.titleBlock}>
        <Breadcrumbs
          items={[
            { label: 'Projects', to: '/projects' },
            { label: projectName },
          ]}
        />
        <Box sx={styles.titleRow}>
          <Typography variant="pageTitle" data-testid="board-header-title">
            {projectName}
          </Typography>
          {isProjectClosed && <ClosedProjectTag />}
        </Box>
      </Box>
      <Box sx={styles.controls}>
        <Typography
          variant="secondaryText"
          data-testid="board-header-task-count"
        >
          {taskCount} tasks
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          data-testid="board-header-view"
          onChange={(_event, next: BoardView | null) => {
            if (next) onViewChange(next)
          }}
          sx={styles.viewToggle}
        >
          <ToggleButton
            value="kanban"
            aria-label="Kanban"
            data-testid="board-header-view-kanban"
          >
            <GridViewIcon sx={styles.viewIcon} />
            <Box component="span" sx={styles.viewLabel}>
              Kanban
            </Box>
          </ToggleButton>
          <ToggleButton
            value="list"
            aria-label="List"
            data-testid="board-header-view-list"
          >
            <ViewListIcon sx={styles.viewIcon} />
            <Box component="span" sx={styles.viewLabel}>
              List
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
        {actions}
      </Box>
    </Box>
  )
}
