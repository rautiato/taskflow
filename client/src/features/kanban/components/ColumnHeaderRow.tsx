import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import { COLUMN_WIDTH } from '../boardLayout'
export const COLUMN_DROPPABLE_ID = 'board-columns'
export const COLUMN_DND_TYPE = 'COLUMN'

export function ColumnHeaderRow({
  columns,
  taskCountByColumn,
  onAddTask,
}: {
  columns: KanbanColumn[]
  taskCountByColumn: Record<string, number>
  onAddTask: (columnId: string) => void
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 0.25 }}>
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
                    <Tooltip title="New Task">
                      <IconButton
                        size="small"
                        onClick={() => onAddTask(column.id)}
                        aria-label="New Task"
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
    </Box>
  )
}
