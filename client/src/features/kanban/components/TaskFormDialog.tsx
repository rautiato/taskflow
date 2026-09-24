import { useMemo, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import type { TaskInput } from '../useKanbanBoard'
import { PRIORITY_STYLES } from '../../tasks/taskDisplay'
import { UserAvatar } from '../../../components/UserAvatar'
import { useAttachments } from '../useAttachments'
import {
  AttachmentPicker,
  type AttachmentPickerHandle,
} from './AttachmentPicker'

const UNASSIGNED = ''

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  columnId: z.string().min(1, 'Column is required.'),
  assigneeId: z.string(),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string(),
  isFavorite: z.boolean(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

function toFormValues(
  task: TaskItem | undefined,
  defaultColumnId: string,
): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
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
  users,
  defaultColumnId,
  onClose,
  onSave,
}: {
  open: boolean
  task?: TaskItem
  columns: KanbanColumn[]
  users: UserDto[]
  defaultColumnId: string
  onClose: () => void
  onSave: (input: TaskInput, taskId: string) => void
}) {
  const isEditing = !!task
  const { control, handleSubmit } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: toFormValues(task, defaultColumnId),
  })

  // Pre-generated so a brand-new task and its attachments share one id
  // before the task itself is ever saved. Reusing this id across two
  // abandoned "Add Task" sessions is harmless — nothing is persisted
  // under it until Save is clicked.
  const taskId = useMemo(() => task?.id ?? crypto.randomUUID(), [task])
  const { attachments: existingAttachments } = useAttachments(taskId)
  const attachmentPickerRef = useRef<AttachmentPickerHandle>(null)

  async function onSubmit(values: TaskFormValues) {
    onSave(
      {
        title: values.title,
        description: values.description,
        columnId: values.columnId,
        assigneeId: values.assigneeId || null,
        priority: values.priority as TaskPriority,
        dueDate: values.dueDate
          ? new Date(values.dueDate).toISOString()
          : null,
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
              name="columnId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Column"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  {columns.map((column) => (
                    <MenuItem key={column.id} value={column.id}>
                      {column.name}
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
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                          >
                            <UserAvatar name={selected?.name ?? null} size="xs" />
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar name={user.name} size="xs" />
                        {user.name}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField {...field} type="date" label="Deadline" fullWidth />
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

          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              Favorite
            </Typography>
            <Controller
              name="isFavorite"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch checked={field.value} onChange={field.onChange} />
                  }
                  label="Pin to top"
                />
              )}
            />
          </Box>

          <AttachmentPicker
            key={taskId}
            ref={attachmentPickerRef}
            taskId={taskId}
            initialAttachments={existingAttachments}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="task-form" variant="contained">
          Save Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}
