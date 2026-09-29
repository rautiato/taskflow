import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import AddIcon from '@mui/icons-material/Add'
import { Breadcrumbs } from '../../../components/Breadcrumbs'

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
  newTaskButton: {
    ml: { xs: 'auto', sm: 0 },
  },
} satisfies Record<string, SxProps<Theme>>

export function BoardHeader({
  projectName,
  taskCount,
  view,
  onViewChange,
  onNewTask,
  columnsMenu,
}: {
  projectName: string
  taskCount: number
  view: BoardView
  onViewChange: (view: BoardView) => void
  onNewTask: () => void
  // Shown between the view toggle and New Task (the board's Manage columns).
  columnsMenu?: ReactNode
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
        <Typography variant="pageTitle" data-testid="board-header-title">
          {projectName}
        </Typography>
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
        {columnsMenu}
        {/* In the header, not the list toolbar, so it's in the same place in
            both views. */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewTask}
          sx={styles.newTaskButton}
          data-testid="board-header-new-task"
        >
          New Task
        </Button>
      </Box>
    </Box>
  )
}
