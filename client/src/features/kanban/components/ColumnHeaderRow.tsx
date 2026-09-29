import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import { COLUMN_WIDTH } from '../boardLayout'
export const COLUMN_DROPPABLE_ID = 'board-columns'
export const COLUMN_DND_TYPE = 'COLUMN'

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    px: 0.25,
  },
  columns: {
    display: 'flex',
    gap: 2,
  },
  column: {
    width: COLUMN_WIDTH,
    display: 'flex',
    alignItems: 'center',
    gap: 0.875,
    borderRadius: 1,
    bgcolor: 'transparent',
    boxShadow: 'none',
  },
  columnDragging: {
    bgcolor: 'background.paper',
    boxShadow: 2,
  },
  dragHandle: {
    display: 'flex',
    cursor: 'grab',
  },
  dragIcon: {
    fontSize: 16,
    color: '#B7BBC1',
  },
  name: {
    fontWeight: 700,
    fontSize: 13,
  },
  count: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 999,
    px: 1.125,
    fontSize: 11,
    fontWeight: 600,
    color: 'text.secondary',
  },
  spacer: {
    flexGrow: 1,
  },
  addButton: {
    color: 'text.secondary',
  },
  addIcon: {
    fontSize: 16,
  },
} satisfies Record<string, SxProps<Theme>>

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
    <Box sx={styles.root} data-testid="column-header-row">
      <Droppable
        droppableId={COLUMN_DROPPABLE_ID}
        direction="horizontal"
        type={COLUMN_DND_TYPE}
      >
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={styles.columns}
          >
            {columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <Box
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    data-testid="column-header"
                    sx={[
                      styles.column,
                      dragSnapshot.isDragging && styles.columnDragging,
                    ]}
                  >
                    <Box
                      {...dragProvided.dragHandleProps}
                      sx={styles.dragHandle}
                      data-testid="column-header-drag-handle"
                    >
                      <DragIndicatorIcon sx={styles.dragIcon} />
                    </Box>
                    <Typography
                      sx={styles.name}
                      data-testid="column-header-name"
                    >
                      {column.name}
                    </Typography>
                    <Box data-testid="column-header-count" sx={styles.count}>
                      {taskCountByColumn[column.id] ?? 0}
                    </Box>
                    <Box sx={styles.spacer} />
                    <Tooltip title="New Task">
                      <IconButton
                        size="small"
                        onClick={() => onAddTask(column.id)}
                        aria-label={`New task in ${column.name}`}
                        sx={styles.addButton}
                        data-testid="column-header-add-task"
                      >
                        <AddIcon sx={styles.addIcon} />
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
