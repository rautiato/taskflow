import Box from '@mui/material/Box'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { SxProps, Theme } from '@mui/material/styles'
import type { TaskItem } from '../../../models/task'
import { TASK_DND_TYPE } from '../taskCellId'
import { TaskCard } from './TaskCard'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
    minHeight: 12,
    borderRadius: 1.5,
    transition: 'background-color 0.15s ease, outline-color 0.15s ease',
  },
  rootDraggingOver: {
    bgcolor: 'action.hover',
    outline: '2px dashed',
    outlineColor: 'primary.main',
    outlineOffset: -2,
  },
  task: {
    opacity: 1,
  },
  taskDragging: {
    opacity: 0.85,
  },
} satisfies Record<string, SxProps<Theme>>

export function AssigneeLaneCell({
  cellId,
  ariaLabel,
  tasks,
  isDoneColumn,
  isDropDisabled,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onToggleFavorite,
}: {
  cellId: string
  ariaLabel: string
  tasks: TaskItem[]
  isDoneColumn: boolean
  isDropDisabled: boolean
  onTaskClick: (task: TaskItem) => void
  onTaskEdit: (task: TaskItem) => void
  onTaskDelete: (task: TaskItem) => void
  onToggleFavorite: (task: TaskItem) => void
}) {
  return (
    <Droppable
      droppableId={cellId}
      type={TASK_DND_TYPE}
      isDropDisabled={isDropDisabled}
    >
      {(dropProvided, dropSnapshot) => (
        <Box
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          role="group"
          aria-label={ariaLabel}
          data-testid="assignee-lane-cell"
          // Drag state as attributes too, so E2E tests can wait on it without
          // depending on how it's styled.
          data-drag-over={dropSnapshot.isDraggingOver || undefined}
          sx={[
            styles.root,
            dropSnapshot.isDraggingOver && styles.rootDraggingOver,
          ]}
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(dragProvided, dragSnapshot) => (
                <Box
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  data-dragging={dragSnapshot.isDragging || undefined}
                  sx={[
                    styles.task,
                    dragSnapshot.isDragging && styles.taskDragging,
                  ]}
                >
                  <TaskCard
                    task={task}
                    isDoneColumn={isDoneColumn}
                    onClick={() => onTaskClick(task)}
                    onEdit={() => onTaskEdit(task)}
                    onDelete={() => onTaskDelete(task)}
                    onToggleFavorite={() => onToggleFavorite(task)}
                  />
                </Box>
              )}
            </Draggable>
          ))}
          {dropProvided.placeholder}
        </Box>
      )}
    </Droppable>
  )
}
