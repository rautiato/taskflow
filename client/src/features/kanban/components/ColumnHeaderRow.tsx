import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import { AddColumnMenu } from './AddColumnMenu'

export const COLUMN_WIDTH = 320
export const COLUMN_DROPPABLE_ID = 'board-columns'
export const COLUMN_DND_TYPE = 'COLUMN'

export function ColumnHeaderRow({
  columns,
  allColumns,
  taskCountByColumn,
  onAddTask,
  onHideColumn,
  onShowColumn,
  onDeleteColumn,
  onCreateColumn,
}: {
  columns: KanbanColumn[]
  allColumns: KanbanColumn[]
  taskCountByColumn: Record<string, number>
  onAddTask: (columnId: string) => void
  onHideColumn: (columnId: string) => void
  onShowColumn: (columnId: string) => void
  onDeleteColumn: (columnId: string) => void
  onCreateColumn: (name: string) => void
}) {
  const [manageColumnsAnchor, setManageColumnsAnchor] =
    useState<HTMLElement | null>(null)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 0.25,
      }}
    >
      <Droppable
        droppableId={COLUMN_DROPPABLE_ID}
        direction="horizontal"
        type={COLUMN_DND_TYPE}
      >
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ display: 'flex', gap: 2 }}
          >
            {columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <Box
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    sx={{
                      width: COLUMN_WIDTH,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.875,
                      borderRadius: 1,
                      bgcolor: dragSnapshot.isDragging
                        ? 'background.paper'
                        : 'transparent',
                      boxShadow: dragSnapshot.isDragging ? 2 : 'none',
                    }}
                  >
                    <Box
                      {...dragProvided.dragHandleProps}
                      sx={{ display: 'flex', cursor: 'grab' }}
                    >
                      <DragIndicatorIcon
                        sx={{ fontSize: 16, color: '#B7BBC1' }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                      {column.name}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 999,
                        px: 1.125,
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'text.secondary',
                      }}
                    >
                      {taskCountByColumn[column.id] ?? 0}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title="Add Task">
                      <IconButton
                        size="small"
                        onClick={() => onAddTask(column.id)}
                        aria-label="Add Task"
                        sx={{ color: 'text.secondary' }}
                      >
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <Box
        component="button"
        type="button"
        onClick={(event) => setManageColumnsAnchor(event.currentTarget)}
        sx={{
          border: '1px dashed #C7CBD1',
          borderRadius: 1,
          px: 1.625,
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
        <ViewColumnOutlinedIcon sx={{ fontSize: 14 }} />
        Manage Columns
      </Box>

      <AddColumnMenu
        anchorEl={manageColumnsAnchor}
        open={!!manageColumnsAnchor}
        onClose={() => setManageColumnsAnchor(null)}
        columns={allColumns}
        taskCountByColumn={taskCountByColumn}
        onHide={onHideColumn}
        onShow={onShowColumn}
        onDelete={onDeleteColumn}
        onCreate={(name) => {
          onCreateColumn(name)
          setManageColumnsAnchor(null)
        }}
      />
    </Box>
  )
}
