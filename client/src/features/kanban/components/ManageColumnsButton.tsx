import { useState } from 'react'
import Box from '@mui/material/Box'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import { AddColumnMenu } from './AddColumnMenu'

// Lives in the page header, not at the end of the column row, so it stays
// on screen however many columns the board has.
export function ManageColumnsButton({
  columns,
  taskCountByColumn,
  onHideColumn,
  onShowColumn,
  onDeleteColumn,
  onCreateColumn,
}: {
  columns: KanbanColumn[]
  taskCountByColumn: Record<string, number>
  onHideColumn: (columnId: string) => void
  onShowColumn: (columnId: string) => void
  onDeleteColumn: (columnId: string) => void
  onCreateColumn: (name: string) => void
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label="Manage Columns"
        onClick={(event) => setAnchor(event.currentTarget)}
        data-testid="manage-columns-button"
        sx={{
          border: '1px dashed #C7CBD1',
          borderRadius: 1,
          px: { xs: 1, sm: 1.625 },
          py: 0.75,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: 'text.secondary',
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
          bgcolor: 'transparent',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <ViewColumnOutlinedIcon sx={{ fontSize: { xs: 18, sm: 14 } }} />
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          Manage Columns
        </Box>
      </Box>

      <AddColumnMenu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        columns={columns}
        taskCountByColumn={taskCountByColumn}
        onHide={onHideColumn}
        onShow={onShowColumn}
        onDelete={onDeleteColumn}
        onCreate={(name) => {
          onCreateColumn(name)
          setAnchor(null)
        }}
      />
    </>
  )
}
