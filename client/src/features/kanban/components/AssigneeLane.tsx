import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { SxProps, Theme } from '@mui/material/styles'
import type { KanbanColumn } from '../../../models/kanbanBoard'

import { TaskCard } from './TaskCard'
import { COLUMN_WIDTH } from './ColumnHeaderRow'
import { TASK_DND_TYPE, taskCellId } from '../taskCellId'
import { UserAvatar } from '../../../components/UserAvatar'
import type { AssigneeLaneData } from '../../tasks/groupTasksByAssignee'

const styles = {
  root: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.25,
    bgcolor: 'background.paper',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  header: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    bgcolor: '#F0F1F4',
    borderRadius: 1,
    px: 1.5,
    py: 0.875,
    display: 'flex',
    alignItems: 'center',
    gap: 1.125,
    cursor: 'pointer',
  },
  name: {
    fontSize: 13,
    fontWeight: 700,
  },
  countChip: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 999,
    px: 1,
    fontSize: 11,
    fontWeight: 600,
    color: 'text.secondary',
  },
  collapseIcon: {
    fontSize: 18,
    color: 'text.secondary',
    ml: 'auto',
    transition: 'transform 0.15s ease',
  },
  columnsRow: {
    display: 'flex',
    gap: 2,
  },
  columnCell: {
    width: COLUMN_WIDTH,
    flexShrink: 0,
  },
  columnDroppable: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
    minHeight: 12,
    borderRadius: 1.5,
    transition: 'background-color 0.15s ease, outline-color 0.15s ease',
  },
} satisfies Record<string, SxProps<Theme>>

export function AssigneeLane({
  lane,
  columns,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onToggleFavorite,
  dragSourceCellId,
}: {
  lane: AssigneeLaneData
  columns: KanbanColumn[]
  onTaskClick: (task: AssigneeLaneData['tasksByColumn'][string][number]) => void
  onTaskEdit: (task: AssigneeLaneData['tasksByColumn'][string][number]) => void
  onTaskDelete: (
    task: AssigneeLaneData['tasksByColumn'][string][number],
  ) => void
  onToggleFavorite: (
    task: AssigneeLaneData['tasksByColumn'][string][number],
  ) => void
  // The cell a task is being dragged out of: it stops accepting drops, since
  // order within a cell is computed (pinned → priority → title), not manual.
  dragSourceCellId: string | null
}) {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => setCollapsed((c) => !c)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleCollapsed()
    }
  }

  return (
    <Box sx={styles.root}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        aria-label={`${lane.assigneeName} lane, ${collapsed ? 'collapsed' : 'expanded'}`}
        onClick={toggleCollapsed}
        onKeyDown={handleKeyDown}
        sx={styles.header}
      >
        <UserAvatar
          id={lane.assigneeId}
          name={lane.assigneeId ? lane.assigneeName : null}
          avatarUrl={lane.assigneeAvatarUrl}
          size="xs"
        />
        <Typography sx={styles.name}>{lane.assigneeName}</Typography>
        <Box sx={styles.countChip}>{lane.taskCount} tasks</Box>
        <ExpandMoreIcon
          sx={[
            styles.collapseIcon,
            { transform: collapsed ? 'rotate(-90deg)' : 'none' },
          ]}
        />
      </Box>
      {!collapsed && (
        <Box sx={styles.columnsRow}>
          {columns.map((column) => (
            <Box key={column.id} sx={styles.columnCell}>
              <Droppable
                droppableId={taskCellId(lane.assigneeId, column.id)}
                type={TASK_DND_TYPE}
                isDropDisabled={
                  taskCellId(lane.assigneeId, column.id) === dragSourceCellId
                }
              >
                {(dropProvided, dropSnapshot) => (
                  <Box
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    sx={[
                      styles.columnDroppable,
                      dropSnapshot.isDraggingOver && {
                        bgcolor: 'action.hover',
                        outline: '2px dashed',
                        outlineColor: 'primary.main',
                        outlineOffset: -2,
                      },
                    ]}
                  >
                    {(lane.tasksByColumn[column.id] ?? []).map(
                      (task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <Box
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              sx={{
                                opacity: dragSnapshot.isDragging ? 0.85 : 1,
                              }}
                            >
                              <TaskCard
                                task={task}
                                isDoneColumn={column.isDone}
                                onClick={() => onTaskClick(task)}
                                onEdit={() => onTaskEdit(task)}
                                onDelete={() => onTaskDelete(task)}
                                onToggleFavorite={() => onToggleFavorite(task)}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ),
                    )}
                    {dropProvided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
