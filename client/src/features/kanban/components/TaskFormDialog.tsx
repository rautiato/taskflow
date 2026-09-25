import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { TaskItem, TaskPriority } from '../../../models/task'
import type { UserDto } from '../../../models/user'
import type { Project } from '../../../models/project'
import type { TaskInput } from '../useKanbanBoard'
import { PRIORITY_STYLES } from '../../tasks/taskDisplay'
import { UserAvatar } from '../../../components/UserAvatar'
import { useAttachments } from '../useAttachments'
import { useProjectColumns } from '../useProjectColumns'
import {
  AttachmentPicker,
  type AttachmentPickerHandle,
} from './AttachmentPicker'

const UNASSIGNED = ''

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  projectId: z.string().min(1, 'Project is required.'),
  columnId: z.string().min(1, 'Status is required.'),
  assigneeId: z.string(),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string(),
  isFavorite: z.boolean(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

function toFormValues(
  task: TaskItem | undefined,
  defaultColumnId: string,
  currentProjectId: string,
): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    projectId: currentProjectId,
    columnId: task?.columnId ?? defaultColumnId,
    assigneeId: task?.assigneeId ?? UNASSIGNED,
    priority: task?.priority ?? 'Medium',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    isFavorite: task?.isFavorite ?? false,
  }
}

export function TaskFormDialog({
  open,
  task,
  columns,
  projects,
  users,
  defaultColumnId,
  currentProjectId,
  onClose,
  onSave,
}: {
  open: boolean
  task?: TaskItem
  columns: KanbanColumn[]
  projects: Project[]
  users: UserDto[]
  defaultColumnId: string
  currentProjectId: string
  onClose: () => void
  onSave: (input: TaskInput, taskId: string) => void
}) {
  // Freeze the title during the Dialog's close transition — the parent
  // clears `task` in the same render that flips `open` to false, but the
  // Dialog stays mounted and visible for its exit animation. Adjusting
  // state during render (React's documented pattern for this, not a ref
  // mutation) so it updates synchronously, before paint.
  const [isEditingSnapshot, setIsEditingSnapshot] = useState(!!task)
  if (open && isEditingSnapshot !== !!task) {
    setIsEditingSnapshot(!!task)
  }
  const isEditing = isEditingSnapshot
  const { control, handleSubmit, getValues, setValue } =
    useForm<TaskFormValues>({
      resolver: zodResolver(taskFormSchema),
      values: toFormValues(task, defaultColumnId, currentProjectId),
    })

  // Pre-generated so a brand-new task and its attachments share one id
  // before the task itself is ever saved. Reusing this id across two
  // abandoned "Add Task" sessions is harmless — nothing is persisted
  // under it until Save is clicked.
  const taskId = useMemo(() => task?.id ?? crypto.randomUUID(), [task])
  const { attachments: existingAttachments } = useAttachments(taskId)
  const attachmentPickerRef = useRef<AttachmentPickerHandle>(null)

  const selectedProjectId = useWatch({ control, name: 'projectId' })
  const isDifferentProject = selectedProjectId !== currentProjectId
  const { columns: otherProjectColumns } = useProjectColumns(
    isDifferentProject ? selectedProjectId : '',
  )
  const availableColumns = isDifferentProject ? otherProjectColumns : columns
  const previousColumnsRef = useRef(availableColumns)

  // Keep the selected column valid whenever the selected project changes
  // (including the initial load, where columns can arrive asynchronously).
  // Prefer a same-named column in the new project (e.g. "In Progress" ->
  // "In Progress") over silently defaulting to whatever is first — a
  // blind index-0 fallback would quietly change a task's status on every
  // project switch, even when an equivalent status exists.
  useEffect(() => {
    // While the destination project's columns are still loading,
    // availableColumns is transiently empty — skip entirely rather than
    // overwriting previousColumnsRef with that empty list, which would
    // erase the outgoing column's name before we ever get to look it up.
    if (availableColumns.length === 0) return

    const currentColumnId = getValues('columnId')
    const stillValid = availableColumns.some((c) => c.id === currentColumnId)
    if (!stillValid) {
      const previousColumn = previousColumnsRef.current.find(
        (c) => c.id === currentColumnId,
      )
      const sameNameColumn = previousColumn
        ? availableColumns.find((c) => c.name === previousColumn.name)
        : undefined
      setValue('columnId', (sameNameColumn ?? availableColumns[0]).id)
    }
    previousColumnsRef.current = availableColumns
  }, [availableColumns, getValues, setValue])

  async function onSubmit(values: TaskFormValues) {
    onSave(
      {
        title: values.title,
        description: values.description,
        columnId: values.columnId,
        assigneeId: values.assigneeId || null,
        priority: values.priority as TaskPriority,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        isFavorite: values.isFavorite,
      },
      taskId,
    )
    await attachmentPickerRef.current?.commit()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {isEditing ? 'Edit Task' : 'Add Task'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack
          spacing={2.5}
          component="form"
          id="task-form"
          noValidate
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
          sx={{ pt: 0.5 }}
        >
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Task Title"
                required
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="projectId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Project"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="columnId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Status"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {availableColumns.map((column) => (
                    <MenuItem key={column.id} value={column.id}>
                      {column.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Assignee"
                  fullWidth
                  slotProps={{
                    select: {
                      renderValue: (value) => {
                        const selected = users.find((u) => u.id === value)
                        return (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <UserAvatar
                              id={selected?.id}
                              name={selected?.name ?? null}
                              avatarUrl={selected?.avatarUrl}
                              size="xs"
                            />
                            {selected?.name ?? 'Unassigned'}
                          </Box>
                        )
                      },
                    },
                  }}
                >
                  <MenuItem value={UNASSIGNED}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserAvatar name={null} size="xs" />
                      Unassigned
                    </Box>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <UserAvatar
                          id={user.id}
                          name={user.name}
                          avatarUrl={user.avatarUrl}
                          size="xs"
                        />
                        {user.name}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priority"
                  fullWidth
                  slotProps={{
                    select: {
                      renderValue: (value) => (
                        <Box
                          component="span"
                          sx={{
                            ...PRIORITY_STYLES[value as TaskPriority],
                            fontSize: 12,
                            fontWeight: 700,
                            px: 1,
                            py: 0.25,
                            borderRadius: 999,
                          }}
                        >
                          {value as string}
                        </Box>
                      ),
                    },
                  }}
                >
                  {(['Low', 'Medium', 'High'] as const).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      <Box
                        component="span"
                        sx={{
                          ...PRIORITY_STYLES[priority],
                          fontSize: 12,
                          fontWeight: 700,
                          px: 1,
                          py: 0.25,
                          borderRadius: 999,
                        }}
                      >
                        {priority}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                required
                fullWidth
                multiline
                minRows={3}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Deadline"
                    fullWidth
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: '1 1 0', minWidth: 0, position: 'relative' }}>
              <Typography
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: 10,
                  px: 0.5,
                  bgcolor: 'background.paper',
                  fontSize: 12,
                  color: 'text.secondary',
                  lineHeight: 1,
                }}
              >
                Favorite
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 1.5,
                  // Fixed to match the outlined TextField's own default
                  // rendered height (56px) — the Switch's intrinsic size
                  // is taller than a text input's line height, so padding
                  // alone kept overshooting it.
                  height: 56,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Controller
                  name="isFavorite"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Pin to top"
                      sx={{ whiteSpace: 'nowrap', mx: 0 }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>

          <AttachmentPicker
            key={taskId}
            ref={attachmentPickerRef}
            taskId={taskId}
            initialAttachments={existingAttachments}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 120 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="task-form"
          variant="contained"
          sx={{ minWidth: 120 }}
        >
          Save Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}
