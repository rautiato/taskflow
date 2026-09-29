import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useUsers } from '../features/auth/useUsers'
import { useProjects } from '../features/projects/useProjects'
import { taskToInput, useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { groupTasksByAssignee } from '../features/tasks/groupTasksByAssignee'
import { sortTasks } from '../features/tasks/sortTasks'
import {
  filterTasks,
  hasActiveFilters,
  DEFAULT_TASK_FILTERS,
} from '../features/tasks/filterTasks'
import type { TaskFilters } from '../features/tasks/filterTasks'
import {
  BoardHeader,
  type BoardView,
} from '../features/kanban/components/BoardHeader'
import { KanbanView } from '../features/kanban/components/KanbanView'
import { ManageColumnsButton } from '../features/kanban/components/ManageColumnsButton'
import { FilterBar } from '../features/kanban/components/FilterBar'
import { TaskListView } from '../features/kanban/components/TaskListView'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import type { TaskItem } from '../models/task'

type FormState = { task?: TaskItem; defaultColumnId: string }

export function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const user = authService.getSession()

  const [view, setView] = useState<BoardView>('kanban')
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_TASK_FILTERS)
  const [formState, setFormState] = useState<FormState | null>(null)
  // The open task lives in the URL (?task=<id>) so a task can be linked to
  // directly (e.g. from the dashboard's "Up next") and Back closes the drawer.
  const [searchParams, setSearchParams] = useSearchParams()
  const detailTaskId = searchParams.get('task')
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
    toggleFavorite,
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
        <Typography
          color="text.secondary"
          data-testid="kanban-board-page-loading"
        >
          Loading board…
        </Typography>
      </AppLayout>
    )
  }

  const project = projects.find((p) => p.id === projectId)
  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const visibleColumns = columns.filter((c) => c.isVisible)
  const taskCountByColumn = columns.reduce<Record<string, number>>(
    (acc, column) => {
      acc[column.id] = tasks.filter((t) => t.columnId === column.id).length
      return acc
    },
    {},
  )
  const listViewTasks = sortTasks(filterTasks(tasks, filters))
  const detailTask = tasks.find((t) => t.id === detailTaskId) ?? null

  function openTask(task: TaskItem) {
    setSearchParams({ task: task.id })
  }

  function closeTask() {
    setSearchParams({}, { replace: true })
  }

  function handleEditTask(task: TaskItem) {
    setFormState({ task, defaultColumnId: task.columnId })
    closeTask()
  }

  function handleDeleteTask(task: TaskItem) {
    setDeleteTarget(task)
    closeTask()
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteTask(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <AppLayout user={user}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        data-testid="kanban-board-page"
      >
        <BoardHeader
          projectName={project.name}
          taskCount={tasks.length}
          view={view}
          onViewChange={setView}
          onNewTask={() =>
            setFormState({ defaultColumnId: visibleColumns[0]?.id ?? '' })
          }
          columnsMenu={
            view === 'kanban' && (
              <ManageColumnsButton
                columns={columns}
                taskCountByColumn={taskCountByColumn}
                onHideColumn={hideColumn}
                onShowColumn={showColumn}
                onDeleteColumn={deleteColumn}
                onCreateColumn={(name) => {
                  if (board) createColumn(board.id, name)
                }}
              />
            )
          }
        />

        {view === 'kanban' ? (
          <KanbanView
            columns={visibleColumns}
            lanes={groupTasksByAssignee(tasks, users)}
            tasks={tasks}
            taskCountByColumn={taskCountByColumn}
            onReorderColumns={(orderedColumnIds) => {
              if (board) reorderColumns(board.id, orderedColumnIds)
            }}
            onMoveTask={(task, target) =>
              updateTask(task.id, { ...taskToInput(task), ...target })
            }
            onAddTask={(columnId) =>
              setFormState({ defaultColumnId: columnId })
            }
            onTaskClick={openTask}
            onTaskEdit={handleEditTask}
            onTaskDelete={handleDeleteTask}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
            data-testid="kanban-board-page-list"
          >
            <FilterBar
              filters={filters}
              onChange={setFilters}
              columns={visibleColumns}
              users={users}
            />
            {hasActiveFilters(filters) && (
              <Typography
                sx={{ fontSize: 13, color: 'text.secondary' }}
                data-testid="kanban-board-page-result-count"
              >
                {listViewTasks.length} task
                {listViewTasks.length === 1 ? '' : 's'} found
              </Typography>
            )}
            <TaskListView
              tasks={listViewTasks}
              columns={columns}
              users={users}
              onTaskClick={openTask}
              onTaskEdit={handleEditTask}
              onTaskDelete={handleDeleteTask}
              onToggleFavorite={toggleFavorite}
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
        onClose={closeTask}
        onEdit={() => detailTask && handleEditTask(detailTask)}
        onDelete={() => detailTask && handleDeleteTask(detailTask)}
        onToggleFavorite={() => detailTask && toggleFavorite(detailTask)}
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
