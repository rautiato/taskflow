import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
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
import { NewTaskButton } from '../features/kanban/components/NewTaskButton'
import { TaskListView } from '../features/kanban/components/TaskListView'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { DeleteTaskDialog } from '../features/kanban/components/DeleteTaskDialog'
import { TaskResultCount } from '../features/kanban/components/TaskResultCount'
import type { TaskItem } from '../models/task'

type FormState = { task?: TaskItem; defaultColumnId: string }

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  // New Task sits in the header row on phones and tablets, beside the view
  // toggle (the filters fill the width there); on desktops it sits at the
  // end of the filter row.
  newTaskInHeader: {
    display: { xs: 'inline-flex', md: 'none' },
    ml: 'auto',
  },
  newTaskInToolbar: {
    display: { xs: 'none', md: 'inline-flex' },
  },
  listToolbar: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
  },
  filters: {
    flexGrow: 1,
    minWidth: 0,
  },
} satisfies Record<string, SxProps<Theme>>

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
  // Load the board only once the project is known to exist: loading a board
  // creates a default one, which an unknown id (a typo, a stale link) must
  // never get.
  const projectExists = projects.some((p) => p.id === projectId)
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
  } = useKanbanBoard(projectExists ? (projectId ?? '') : '')

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

  function openNewTask() {
    setFormState({ defaultColumnId: visibleColumns[0]?.id ?? '' })
  }

  function handleEditTask(task: TaskItem) {
    setFormState({ task, defaultColumnId: task.columnId })
    closeTask()
  }

  function handleDeleteTask(task: TaskItem) {
    setDeleteTarget(task)
    closeTask()
  }

  return (
    <AppLayout user={user}>
      <Box sx={styles.root} data-testid="kanban-board-page">
        <BoardHeader
          projectName={project.name}
          isProjectClosed={project.status === 'Closed'}
          taskCount={tasks.length}
          view={view}
          onViewChange={setView}
          actions={
            view === 'kanban' ? (
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
            ) : (
              <NewTaskButton
                onClick={openNewTask}
                sx={styles.newTaskInHeader}
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
          <Box sx={styles.list} data-testid="kanban-board-page-list">
            <Box sx={styles.listToolbar}>
              <Box sx={styles.filters}>
                <FilterBar
                  filters={filters}
                  onChange={setFilters}
                  columns={visibleColumns}
                  users={users}
                />
              </Box>
              <NewTaskButton
                onClick={openNewTask}
                sx={styles.newTaskInToolbar}
              />
            </Box>
            {hasActiveFilters(filters) && (
              <TaskResultCount
                count={listViewTasks.length}
                testId="kanban-board-page-result-count"
              />
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
        task={detailTask}
        columns={columns}
        users={users}
        currentUser={user}
        onClose={closeTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleFavorite={toggleFavorite}
      />

      <DeleteTaskDialog
        task={deleteTarget}
        onConfirm={(task) => {
          deleteTask(task.id)
          setDeleteTarget(null)
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  )
}
