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
import { useAllTasks, useMyTasks } from '../features/kanban/useTaskLists'
import { useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { sortTasks } from '../features/tasks/sortTasks'
import {
  EMPTY_TASK_LIST_FILTERS,
  hasActiveTaskListFilters,
  filterTaskList,
  filtersFromSearchParams,
  filtersToSearchParams,
  type TaskListFilters,
} from '../features/tasks/taskListFilters'
import {
  sortFromSearchParams,
  writeSortToSearchParams,
  type SortState,
} from '../features/tasks/taskListSort'
import {
  buildTaskListLookups,
  statusOptionsFor,
} from '../features/tasks/taskListLookups'
import { TaskListFilterBar } from '../features/kanban/components/TaskListFilterBar'
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

export type TasksScope = 'mine' | 'all'

// What differs between My Tasks and All Tasks; everything else is shared.
const SCOPES = {
  mine: {
    title: 'My Tasks',
    testId: 'my-tasks-page',
    emptyTitle: 'No tasks assigned to you',
    emptyDescription:
      'Tasks assigned to you across every project will show up here.',
  },
  all: {
    title: 'All Tasks',
    testId: 'all-tasks-page',
    emptyTitle: 'No tasks yet',
    emptyDescription: 'Tasks from every project will show up here.',
  },
} as const

// My Tasks (scope "mine") and All Tasks (scope "all") are one page: the
// same filters, table and drawer, over the viewer's tasks or everyone's.
export function TasksPage({ scope }: { scope: TasksScope }) {
  const config = SCOPES[scope]
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

  function handleFiltersChange(next: TaskListFilters) {
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
  // Both hooks always run (React's rule); only the one for this scope fetches.
  const mine = useMyTasks(scope === 'mine' ? (user?.id ?? '') : '')
  const all = useAllTasks(scope === 'all')
  const { tasks, columns, boards, isLoading } = scope === 'mine' ? mine : all
  // Mutations only — the read query stays disabled (empty projectId). Safe:
  // with no cached board the optimistic updates are no-ops, and every
  // mutation invalidates the task lists, so this page still refreshes.
  const { updateTask, toggleFavorite, deleteTask } = useKanbanBoard('')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const {
    projectIdByColumnId,
    projectNameByColumnId,
    statusNameByColumnId,
    projectStatusByColumnId,
    projectsWithTasks,
    creatorsWithTasks,
    assigneesWithTasks,
  } = buildTaskListLookups({ tasks, columns, boards, projects, users })
  const statusOptions = statusOptionsFor(
    columns,
    projectIdByColumnId,
    filters.projectIds,
  )
  const visibleTasks = sortTasks(
    filterTaskList(
      tasks,
      filters,
      projectIdByColumnId,
      statusNameByColumnId,
      projectStatusByColumnId,
    ),
  )
  const detailTask = tasks.find((t) => t.id === openTaskId) ?? null

  // Hidden columns are unused, so they aren't offered. The task's own column
  // is kept, so a task already in one keeps its status until it's moved.
  function columnsForTask(task: TaskItem): KanbanColumn[] {
    const taskColumn = columns.find((c) => c.id === task.columnId)
    return columns.filter(
      (c) =>
        c.boardId === taskColumn?.boardId &&
        (c.isVisible || c.id === task.columnId),
    )
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
      <Box sx={styles.root} data-testid={config.testId}>
        <Typography variant="pageTitle" data-testid={`${config.testId}-title`}>
          {config.title}
        </Typography>

        {isLoading ? (
          <Typography
            color="text.secondary"
            data-testid={`${config.testId}-loading`}
          >
            Loading…
          </Typography>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<InboxOutlinedIcon sx={styles.emptyIcon} />}
            title={config.emptyTitle}
            description={config.emptyDescription}
          />
        ) : (
          <Box sx={styles.content}>
            <TaskListFilterBar
              filters={filters}
              onChange={handleFiltersChange}
              projects={projectsWithTasks}
              statusOptions={statusOptions}
              creators={creatorsWithTasks}
              assignees={scope === 'all' ? assigneesWithTasks : undefined}
            />
            {hasActiveTaskListFilters(filters) && (
              <Box sx={styles.resultBar}>
                <TaskResultCount
                  count={visibleTasks.length}
                  testId={`${config.testId}-result-count`}
                />
                <Link
                  component="button"
                  onClick={() => handleFiltersChange(EMPTY_TASK_LIST_FILTERS)}
                  sx={styles.clearFilters}
                  data-testid={`${config.testId}-clear-filters`}
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
              projectStatusByColumnId={projectStatusByColumnId}
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
