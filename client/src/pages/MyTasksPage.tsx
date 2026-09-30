import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import type { SxProps, Theme } from '@mui/material/styles'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useUsers } from '../features/auth/useUsers'
import { useProjects } from '../features/projects/useProjects'
import { useMyTasks } from '../features/kanban/useMyTasks'
import { useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { sortTasks } from '../features/tasks/sortTasks'
import {
  EMPTY_MY_TASKS_FILTERS,
  hasActiveMyTasksFilters,
  filterMyTasks,
  filtersFromSearchParams,
  filtersToSearchParams,
  type MyTasksFilters,
} from '../features/tasks/filterMyTasks'
import {
  sortFromSearchParams,
  writeSortToSearchParams,
  type SortState,
} from '../features/tasks/taskListSort'
import {
  buildMyTasksLookups,
  statusOptionsFor,
} from '../features/tasks/myTasksLookups'
import { MyTasksFilterBar } from '../features/kanban/components/MyTasksFilterBar'
import { TaskListView } from '../features/kanban/components/TaskListView'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { DeleteTaskDialog } from '../features/kanban/components/DeleteTaskDialog'
import { TaskResultCount } from '../features/kanban/components/TaskResultCount'
import { EmptyState } from '../components/EmptyState'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { TaskItem } from '../models/task'
import type { KanbanColumn } from '../models/kanbanBoard'

type FormState = { task: TaskItem; projectId: string }

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  emptyIcon: {
    fontSize: 40,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },
  resultBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },
  clearFilters: {
    fontSize: 13,
    fontWeight: 600,
  },
} satisfies Record<string, SxProps<Theme>>

export function MyTasksPage() {
  const user = authService.getSession()
  // Filters, sort and the open task all live in the URL, so any view is
  // linkable — the dashboard tiles link straight to one.
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = filtersFromSearchParams(searchParams)
  const sort = sortFromSearchParams(searchParams)
  const openTaskId = searchParams.get('task')

  function updateParams(
    change: (params: URLSearchParams) => void,
    replace = true,
  ) {
    const next = new URLSearchParams(searchParams)
    change(next)
    setSearchParams(next, { replace })
  }

  function handleFiltersChange(next: MyTasksFilters) {
    // Filters are rewritten; sort and the open task are kept.
    const params = filtersToSearchParams(next)
    writeSortToSearchParams(params, sort)
    if (openTaskId) params.set('task', openTaskId)
    setSearchParams(params, { replace: true })
  }

  function handleSortChange(next: SortState) {
    updateParams((params) => writeSortToSearchParams(params, next))
  }

  function openTask(task: TaskItem) {
    // Push, not replace, so Back closes the drawer.
    updateParams((params) => params.set('task', task.id), false)
  }

  function closeTask() {
    updateParams((params) => params.delete('task'))
  }

  const [formState, setFormState] = useState<FormState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)

  const { projects } = useProjects()
  const users = useUsers()
  const { tasks, columns, boards, isLoading } = useMyTasks(user?.id ?? '')
  // Mutations only — the read query stays disabled (empty projectId). Safe:
  // with no cached board the optimistic updates are no-ops, and every
  // mutation invalidates My Tasks, so this page still refreshes.
  const { updateTask, toggleFavorite, deleteTask } = useKanbanBoard('')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const {
    projectIdByColumnId,
    projectNameByColumnId,
    statusNameByColumnId,
    projectsWithMyTasks,
    creatorsWithMyTasks,
  } = buildMyTasksLookups({ tasks, columns, boards, projects, users })
  const statusOptions = statusOptionsFor(
    columns,
    projectIdByColumnId,
    filters.projectIds,
  )
  const visibleTasks = sortTasks(
    filterMyTasks(tasks, filters, projectIdByColumnId, statusNameByColumnId),
  )
  const detailTask = tasks.find((t) => t.id === openTaskId) ?? null

  function columnsForTask(task: TaskItem): KanbanColumn[] {
    const taskColumn = columns.find((c) => c.id === task.columnId)
    return columns.filter((c) => c.boardId === taskColumn?.boardId)
  }

  function projectIdForTask(task: TaskItem): string {
    return projectIdByColumnId[task.columnId] ?? ''
  }

  function handleEditTask(task: TaskItem) {
    setFormState({ task, projectId: projectIdForTask(task) })
    closeTask()
  }

  function handleDeleteTask(task: TaskItem) {
    setDeleteTarget(task)
    closeTask()
  }

  return (
    <AppLayout user={user}>
      <Box sx={styles.root} data-testid="my-tasks-page">
        <Typography variant="pageTitle" data-testid="my-tasks-page-title">
          My Tasks
        </Typography>

        {isLoading ? (
          <Typography
            color="text.secondary"
            data-testid="my-tasks-page-loading"
          >
            Loading…
          </Typography>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<InboxOutlinedIcon sx={styles.emptyIcon} />}
            title="No tasks assigned to you"
            description="Tasks assigned to you across every project will show up here."
          />
        ) : (
          <Box sx={styles.content}>
            <MyTasksFilterBar
              filters={filters}
              onChange={handleFiltersChange}
              projects={projectsWithMyTasks}
              statusOptions={statusOptions}
              creators={creatorsWithMyTasks}
            />
            {hasActiveMyTasksFilters(filters) && (
              <Box sx={styles.resultBar}>
                <TaskResultCount
                  count={visibleTasks.length}
                  testId="my-tasks-page-result-count"
                />
                <Link
                  component="button"
                  onClick={() => handleFiltersChange(EMPTY_MY_TASKS_FILTERS)}
                  sx={styles.clearFilters}
                  data-testid="my-tasks-page-clear-filters"
                >
                  Clear filters
                </Link>
              </Box>
            )}
            <TaskListView
              tasks={visibleTasks}
              columns={columns}
              users={users}
              projectNameByColumnId={projectNameByColumnId}
              onTaskClick={openTask}
              sort={sort}
              onSortChange={handleSortChange}
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
        columns={formState ? columnsForTask(formState.task) : []}
        projects={projects}
        users={users}
        defaultColumnId={formState?.task.columnId ?? ''}
        currentProjectId={formState?.projectId ?? ''}
        onClose={() => setFormState(null)}
        onSave={(input, taskId) => {
          updateTask(taskId, input)
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
