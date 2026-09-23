import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AppLayout } from '../features/layout/components/AppLayout'
import { authService } from '../features/auth/authService'
import { useUsers } from '../features/auth/useUsers'
import { useProjects } from '../features/projects/useProjects'
import { useKanbanBoard } from '../features/kanban/useKanbanBoard'
import { groupTasksByAssignee } from '../features/tasks/groupTasksByAssignee'
import { ColumnHeaderRow } from '../features/kanban/components/ColumnHeaderRow'
import { AssigneeLane } from '../features/kanban/components/AssigneeLane'
import { TaskFormDialog } from '../features/kanban/components/TaskFormDialog'
import { TaskDetailDrawer } from '../features/kanban/components/TaskDetailDrawer'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { Breadcrumbs } from '../components/Breadcrumbs'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { TaskItem } from '../models/task'

type FormState = { task?: TaskItem; defaultColumnId: string }

export function KanbanBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const user = authService.getSession()

  const [formState, setFormState] = useState<FormState | null>(null)
  const [detailTask, setDetailTask] = useState<TaskItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null)

  const { projects, isLoading: projectsLoading } = useProjects()
  const users = useUsers()
  const {
    columns,
    tasks,
    isLoading: boardLoading,
    createTask,
    updateTask,
    deleteTask,
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

  const assigneeLanes = groupTasksByAssignee(tasks, users)
  const taskCountByColumn = columns.reduce<Record<string, number>>(
    (acc, column) => {
      acc[column.id] = tasks.filter((t) => t.columnId === column.id).length
      return acc
    },
    {},
  )

  function handleEditFromDetail() {
    if (!detailTask) return
    setFormState({ task: detailTask, defaultColumnId: detailTask.columnId })
    setDetailTask(null)
  }

  function handleDeleteFromDetail() {
    if (!detailTask) return
    setDeleteTarget(detailTask)
    setDetailTask(null)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteTask(deleteTarget.id)
    setDeleteTarget(null)
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
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {columns.length} columns · {tasks.length} tasks
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ColumnHeaderRow
            columns={columns}
            taskCountByColumn={taskCountByColumn}
            onAddTask={(columnId) =>
              setFormState({ defaultColumnId: columnId })
            }
          />
          <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
          {assigneeLanes.length === 0 ? (
            <EmptyState
              icon={<InboxOutlinedIcon sx={{ fontSize: 40 }} />}
              title="No tasks yet"
              description="Add a task to any column to get started."
            />
          ) : (
            assigneeLanes.map((lane, index) => (
              <AssigneeLane
                key={lane.assigneeId ?? 'unassigned'}
                lane={lane}
                columns={columns}
                colorIndex={index}
                onTaskClick={setDetailTask}
              />
            ))
          )}
        </Box>
      </Box>

      <TaskFormDialog
        open={!!formState}
        task={formState?.task}
        columns={columns}
        users={users}
        defaultColumnId={formState?.defaultColumnId ?? columns[0]?.id ?? ''}
        onClose={() => setFormState(null)}
        onSave={(input) => {
          if (formState?.task) {
            updateTask(formState.task.id, input)
          } else {
            createTask(input)
          }
          setFormState(null)
        }}
      />

      <TaskDetailDrawer
        open={!!detailTask}
        task={detailTask}
        column={columns.find((c) => c.id === detailTask?.columnId)}
        assignee={users.find((u) => u.id === detailTask?.assigneeId)}
        onClose={() => setDetailTask(null)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
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
