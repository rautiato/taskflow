import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useUsers } from '../features/auth/useUsers'
import { useProjects } from '../features/projects/useProjects'
import { useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { groupTasksByAssignee } from '../features/tasks/groupTasksByAssignee'
import { sortTasks } from '../features/tasks/sortTasks'
import {
  filterTasks,
  hasActiveFilters,
  DEFAULT_TASK_FILTERS,
} from '../features/tasks/filterTasks'
import type { TaskFilters } from '../features/tasks/filterTasks'
import {
  ColumnHeaderRow,
  COLUMN_DND_TYPE,
} from '../features/kanban/components/ColumnHeaderRow'
import { TASK_DND_TYPE, parseTaskCellId } from '../features/kanban/taskCellId'
import { AssigneeLane } from '../features/kanban/components/AssigneeLane'
import { FilterBar } from '../features/kanban/components/FilterBar'
import { TaskListView } from '../features/kanban/components/TaskListView'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { Breadcrumbs } from '../components/Breadcrumbs'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { TaskItem } from '../models/task'

type FormState = { task?: TaskItem; defaultColumnId: string }
type BoardView = 'kanban' | 'list'

export function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const user = authService.getSession()

  const [view, setView] = useState<BoardView>('kanban')
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)

  const { projects, isLoading: projectsLoading } = useProjects()
  const users = useUsers()
  const {
    board,
    columns,
    tasks,
    isLoading: boardLoading,
    createTask,
    updateTask,
    deleteTask,
    reorderColumns,
    hideColumn,
    showColumn,
    deleteColumn,
    createColumn,
  } = useKanbanBoard(projectId ?? '')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (projectsLoading || boardLoading) {
    return (
      <AppLayout user={user}>
        <Typography color="text.secondary">Loading board…</Typography>
      </AppLayout>
    )
  }

  const project = projects.find((p) => p.id === projectId)
  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const visibleColumns = columns.filter((c) => c.isVisible)
  const assigneeLanes = groupTasksByAssignee(tasks, users)
  const taskCountByColumn = columns.reduce<Record<string, number>>(
    (acc, column) => {
      acc[column.id] = tasks.filter((t) => t.columnId === column.id).length
      return acc
    },
    {},
  )
  const listViewTasks = sortTasks(filterTasks(tasks, filters))

  function handleEditTask(task: TaskItem) {
    setFormState({ task, defaultColumnId: task.columnId })
    setDetailTask(null)
  }

  function handleDeleteTask(task: TaskItem) {
    setDeleteTarget(task)
    setDetailTask(null)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteTask(deleteTarget.id)
    setDeleteTarget(null)
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    if (result.type === COLUMN_DND_TYPE) {
      if (!board || result.destination.index === result.source.index) return
      const reordered = Array.from(visibleColumns)
      const [moved] = reordered.splice(result.source.index, 1)
      reordered.splice(result.destination.index, 0, moved)
      reorderColumns(
        board.id,
        reordered.map((c) => c.id),
      )
      return
    }

    if (result.type === TASK_DND_TYPE) {
      if (result.destination.droppableId === result.source.droppableId) return
      const task = tasks.find((t) => t.id === result.draggableId)
      if (!task) return
      const { assigneeId, columnId } = parseTaskCellId(
        result.destination.droppableId,
      )
      updateTask(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        isFavorite: task.isFavorite,
        columnId,
        assigneeId,
      })
    }
  }

  return (
    <AppLayout user={user}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Breadcrumbs
              items={[
                { label: 'Projects', to: '/projects' },
                { label: project.name },
              ]}
            />
            <Typography sx={{ fontSize: 25, fontWeight: 700 }}>
              {project.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              {tasks.length} tasks
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              size="small"
              onChange={(_event, next: BoardView | null) => {
                if (next) setView(next)
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
              <ToggleButton value="kanban">
                <GridViewIcon sx={{ fontSize: 16, mr: 0.75 }} />
                Kanban
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon sx={{ fontSize: 16, mr: 0.75 }} />
                List
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {view === 'kanban' ? (
          <DragDropContext onDragEnd={handleDragEnd}>
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
                  columns={visibleColumns}
                  allColumns={columns}
                  taskCountByColumn={taskCountByColumn}
                  onAddTask={(columnId) =>
                    setFormState({ defaultColumnId: columnId })
                  }
                  onHideColumn={hideColumn}
                  onShowColumn={showColumn}
                  onDeleteColumn={deleteColumn}
                  onCreateColumn={(name) => {
                    if (board) createColumn(board.id, name)
                  }}
                />
                <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
                {assigneeLanes.length === 0 ? (
                  <EmptyState
                    icon={<InboxOutlinedIcon sx={{ fontSize: 40 }} />}
                    title="No tasks yet"
                    description="Add a task to any column to get started."
                  />
                ) : (
                  assigneeLanes.map((lane) => (
                    <AssigneeLane
                      key={lane.assigneeId ?? 'unassigned'}
                      lane={lane}
                      columns={visibleColumns}
                      onTaskClick={setDetailTask}
                      onTaskEdit={handleEditTask}
                      onTaskDelete={handleDeleteTask}
                    />
                  ))
                )}
              </Box>
            </Box>
          </DragDropContext>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <FilterBar
                  filters={filters}
                  onChange={setFilters}
                  columns={visibleColumns}
                  users={users}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setFormState({ defaultColumnId: visibleColumns[0]?.id ?? '' })
                }
                sx={{ flexShrink: 0 }}
              >
                New Task
              </Button>
            </Box>
            {hasActiveFilters(filters) && (
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {listViewTasks.length} task
                {listViewTasks.length === 1 ? '' : 's'} found
              </Typography>
            )}
            <TaskListView
              tasks={listViewTasks}
              columns={columns}
              users={users}
              onTaskClick={setDetailTask}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
            />
          </Box>
        )}
      </Box>

      <TaskFormDialog
        open={!!formState}
        task={formState?.task}
        columns={visibleColumns}
        projects={projects}
        users={users}
        defaultColumnId={
          formState?.defaultColumnId ?? visibleColumns[0]?.id ?? ''
        }
        currentProjectId={projectId}
        onClose={() => setFormState(null)}
        onSave={(input, taskId) => {
          if (formState?.task) {
            updateTask(formState.task.id, input)
          } else {
            createTask(input, user.id, taskId)
          }
          setFormState(null)
        }}
      />

      <TaskDetailDrawer
        open={!!detailTask}
        task={detailTask}
        column={columns.find((c) => c.id === detailTask?.columnId)}
        assignee={users.find((u) => u.id === detailTask?.assigneeId)}
        creator={users.find((u) => u.id === detailTask?.createdById)}
        users={users}
        currentUser={user}
        onClose={() => setDetailTask(null)}
        onEdit={() => detailTask && handleEditTask(detailTask)}
        onDelete={() => detailTask && handleDeleteTask(detailTask)}
      />

      {deleteTarget && (
        <ConfirmDialog
          open
          title="Delete this task?"
          description={`This action can't be undone. "${deleteTarget.title}" will be permanently removed.`}
          confirmLabel="Delete"
          destructive
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AppLayout>
  )
}
