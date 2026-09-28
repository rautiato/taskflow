import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Button from '@mui/material/Button'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import AddIcon from '@mui/icons-material/Add'
import { Breadcrumbs } from '../../../components/Breadcrumbs'

export type BoardView = 'kanban' | 'list'

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
    // Phones: title on its own row, controls on the next.
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'flex-end' },
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Breadcrumbs
          items={[
            { label: 'Projects', to: '/projects' },
            { label: projectName },
          ]}
        />
        <Typography sx={{ fontSize: { xs: 20, sm: 25 }, fontWeight: 700 }}>
          {projectName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          {taskCount} tasks
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          size="small"
          onChange={(_event, next: BoardView | null) => {
            if (next) onViewChange(next)
          }}
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              borderColor: 'divider',
              px: 1.5,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            },
          }}
        >
          {/* Icon-only on phones; aria-label keeps the name. */}
          <ToggleButton value="kanban" aria-label="Kanban">
            <GridViewIcon sx={{ fontSize: 16, mr: { xs: 0, sm: 0.75 } }} />
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
              Kanban
            </Box>
          </ToggleButton>
          <ToggleButton value="list" aria-label="List">
            <ViewListIcon sx={{ fontSize: 16, mr: { xs: 0, sm: 0.75 } }} />
            <Box
              component="span"
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >
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
          sx={{ ml: { xs: 'auto', sm: 0 } }}
        >
          New Task
        </Button>
      </Box>
    </Box>
  )
}
