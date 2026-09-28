import { useState } from 'react'
import {
  DragDropContext,
  type DragStart,
  type DropResult,
} from '@hello-pangea/dnd'
import Box from '@mui/material/Box'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { EmptyState } from '../../../components/EmptyState'
import type { AssigneeLaneData } from '../../tasks/groupTasksByAssignee'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { TaskItem } from '../../../models/task'
import { TASK_DND_TYPE, parseTaskCellId } from '../taskCellId'
import { ColumnHeaderRow, COLUMN_DND_TYPE } from './ColumnHeaderRow'
import { AssigneeLane } from './AssigneeLane'

/**
 * The board: column headers plus one lane per assignee, with drag-and-drop
 * for reordering columns and for moving tasks between cells (a new column
 * and/or a new assignee).
 */
export function KanbanView({
  columns,
  lanes,
  tasks,
  taskCountByColumn,
  onReorderColumns,
  onMoveTask,
  onAddTask,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onToggleFavorite,
}: {
  // Visible columns only, in display order.
  columns: KanbanColumn[]
  lanes: AssigneeLaneData[]
  tasks: TaskItem[]
  taskCountByColumn: Record<string, number>
  onReorderColumns: (orderedColumnIds: string[]) => void
  onMoveTask: (
    task: TaskItem,
    target: { columnId: string; assigneeId: string | null },
  ) => void
  onAddTask: (columnId: string) => void
  onTaskClick: (task: TaskItem) => void
  onTaskEdit: (task: TaskItem) => void
  onTaskDelete: (task: TaskItem) => void
  onToggleFavorite: (task: TaskItem) => void
}) {
  const [dragSourceCellId, setDragSourceCellId] = useState<string | null>(null)

  function handleDragStart(start: DragStart) {
    if (start.type === TASK_DND_TYPE) {
      setDragSourceCellId(start.source.droppableId)
    }
  }

  function handleDragEnd(result: DropResult) {
    setDragSourceCellId(null)
    if (!result.destination) return

    if (result.type === COLUMN_DND_TYPE) {
      if (result.destination.index === result.source.index) return
      const reordered = Array.from(columns)
      const [moved] = reordered.splice(result.source.index, 1)
      reordered.splice(result.destination.index, 0, moved)
      onReorderColumns(reordered.map((c) => c.id))
      return
    }

    if (result.type === TASK_DND_TYPE) {
      if (result.destination.droppableId === result.source.droppableId) return
      const task = tasks.find((t) => t.id === result.draggableId)
      if (!task) return
      onMoveTask(task, parseTaskCellId(result.destination.droppableId))
    }
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: 'max-content',
            minWidth: '100%',
          }}
        >
          <ColumnHeaderRow
            columns={columns}
            taskCountByColumn={taskCountByColumn}
            onAddTask={onAddTask}
          />
          <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
          {lanes.length === 0 ? (
            <EmptyState
              icon={<InboxOutlinedIcon sx={{ fontSize: 40 }} />}
              title="No tasks yet"
              description="Add a task to any column to get started."
            />
          ) : (
            lanes.map((lane) => (
              <AssigneeLane
                key={lane.assigneeId ?? 'unassigned'}
                lane={lane}
                columns={columns}
                onTaskClick={onTaskClick}
                onTaskEdit={onTaskEdit}
                onTaskDelete={onTaskDelete}
                onToggleFavorite={onToggleFavorite}
                dragSourceCellId={dragSourceCellId}
              />
            ))
          )}
        </Box>
      </Box>
    </DragDropContext>
  )
}
