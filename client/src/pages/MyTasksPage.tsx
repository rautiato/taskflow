import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useUsers } from '../features/auth/useUsers'
import { useProjects } from '../features/projects/useProjects'
import { useMyTasks } from '../features/kanban/useMyTasks'
import { useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { sortTasks } from '../features/tasks/sortTasks'
import {
  ALL,
  DEFAULT_MY_TASKS_FILTERS,
  hasActiveMyTasksFilters,
  filterMyTasks,
  type MyTasksFilters,
} from '../features/tasks/filterMyTasks'
import { MyTasksFilterBar } from '../features/kanban/components/MyTasksFilterBar'
import { TaskListView } from '../features/kanban/components/TaskListView'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { TaskItem } from '../models/task'
import type { KanbanColumn } from '../models/kanbanBoard'

type FormState = { task: TaskItem; projectId: string }

export function MyTasksPage() {
  const user = authService.getSession()
  const [filters, setFilters] = useState<MyTasksFilters>(
    DEFAULT_MY_TASKS_FILTERS,
  )
  const [formState, setFormState] = useState<FormState | null>(null)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)

  const { projects } = useProjects()
  const users = useUsers()
  const { tasks, columns, boards, isLoading } = useMyTasks(user?.id ?? '')
  // Mutations only — read query stays disabled (empty projectId); see
  // PLAN.md §3's "My Tasks page" decision for why this is safe to reuse.
  const { updateTask, deleteTask } = useKanbanBoard('')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const boardById = new Map(boards.map((b) => [b.id, b]))
  const projectById = new Map(projects.map((p) => [p.id, p]))

  const projectIdByColumnId: Record<string, string> = {}
  const projectNameByColumnId: Record<string, string> = {}
  for (const column of columns) {
    const board = boardById.get(column.boardId)
    const project = board && projectById.get(board.projectId)
    if (project) {
      projectIdByColumnId[column.id] = project.id
      projectNameByColumnId[column.id] = project.name
    }
  }

  // Only projects the user actually has a task in — picking one that can
  // only ever show "no tasks match" isn't a useful filter option.
  const projectsWithMyTasks = projects.filter((project) =>
    tasks.some((task) => projectIdByColumnId[task.columnId] === project.id),
  )

  // Same reasoning as projectsWithMyTasks — only list users who actually
  // created one of these tasks.
  const creatorsWithMyTasks = users.filter((creator) =>
    tasks.some((task) => task.createdById === creator.id),
  )

  // With no project selected, statuses collapse to their name across every
  // project (one "To Do", not one per project) — with a project selected,
  // it narrows to just that project's own columns, in board order.
  const statusOptions = (() => {
    const relevant =
      filters.projectId === ALL
        ? columns
        : columns.filter(
            (c) => projectIdByColumnId[c.id] === filters.projectId,
          )
    const seen = new Set<string>()
    const names: string[] = []
    for (const column of [...relevant].sort((a, b) => a.order - b.order)) {
      if (!seen.has(column.name)) {
        seen.add(column.name)
        names.push(column.name)
      }
    }
    return names
  })()

  function columnsForTask(task: TaskItem): KanbanColumn[] {
    const taskColumn = columns.find((c) => c.id === task.columnId)
    return columns.filter((c) => c.boardId === taskColumn?.boardId)
  }

  function projectIdForTask(task: TaskItem): string {
    return projectIdByColumnId[task.columnId] ?? ''
  }

  function handleEditTask(task: TaskItem) {
    setFormState({ task, projectId: projectIdForTask(task) })
    setDetailTask(null)
  }

  function handleDeleteTask(task: TaskItem) {
    setDeleteTarget(task)
    setDetailTask(null)
  }

  const statusNameByColumnId: Record<string, string> = {}
  for (const column of columns) {
    statusNameByColumnId[column.id] = column.name
  }

  const visibleTasks = sortTasks(
    filterMyTasks(tasks, filters, projectIdByColumnId, statusNameByColumnId),
  )

  return (
    <AppLayout user={user}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: 25, fontWeight: 700 }}>
          My Tasks
        </Typography>

        {isLoading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<InboxOutlinedIcon sx={{ fontSize: 40 }} />}
            title="No tasks assigned to you"
            description="Tasks assigned to you across every project will show up here."
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <MyTasksFilterBar
              filters={filters}
              onChange={setFilters}
              projects={projectsWithMyTasks}
              statusOptions={statusOptions}
              creators={creatorsWithMyTasks}
            />
            {hasActiveMyTasksFilters(filters) && (
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                {visibleTasks.length} task
                {visibleTasks.length === 1 ? '' : 's'} found
              </Typography>
            )}
            <TaskListView
              tasks={visibleTasks}
              columns={columns}
              users={users}
              projectNameByColumnId={projectNameByColumnId}
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
          onConfirm={() => {
            deleteTask(deleteTarget.id)
            setDeleteTarget(null)
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </AppLayout>
  )
}
