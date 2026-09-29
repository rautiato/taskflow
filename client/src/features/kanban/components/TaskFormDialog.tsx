import { useMemo, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { TaskItem, TaskPriority } from '../../../models/task'
import type { UserDto } from '../../../models/user'
import type { Project } from '../../../models/project'
import type { TaskInput } from '../useKanbanBoard'
import { useAttachments } from '../useAttachments'
import { useStatusColumns } from '../useStatusColumns'
import {
  taskFormSchema,
  toFormValues,
  type TaskFormValues,
} from '../taskFormSchema'
import { notifyError } from '../../../services/notifications'
import { errorMessage } from '../../../utils/errorMessage'
import { testIdProps } from '../../../utils/testIdProps'
import {
  AttachmentPicker,
  type AttachmentPickerHandle,
} from './AttachmentPicker'
import { AssigneeSelect } from './AssigneeSelect'
import { PrioritySelect } from './PrioritySelect'
import { FavoriteSwitchField } from './FavoriteSwitchField'

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

  const availableColumns = useStatusColumns({
    control,
    getValues,
    setValue,
    columns,
    currentProjectId,
  })
  // Full screen on phones: a long form in a floating dialog leaves little
  // room once the on-screen keyboard is up.
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

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
    try {
      await attachmentPickerRef.current?.commit()
    } catch (error) {
      // The dialog has already closed, so say plainly what was and wasn't
      // saved. This replaces the global handler's generic message.
      notifyError(
        `Task saved, but its attachments weren't. ${errorMessage(error, '')}`.trim(),
      )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      slotProps={{ paper: testIdProps('task-form-dialog') }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        data-testid="task-form-dialog-title"
      >
        {isEditing ? 'Edit Task' : 'Add Task'}
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          data-testid="task-form-dialog-close"
        >
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
          data-testid="task-form-dialog-form"
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
                slotProps={{
                  htmlInput: testIdProps('task-form-dialog-title-input'),
                  formHelperText: testIdProps(
                    'task-form-dialog-title-input-helper',
                  ),
                }}
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
                  slotProps={{
                    select: {
                      SelectDisplayProps: testIdProps(
                        'task-form-dialog-project',
                      ),
                    },
                    formHelperText: testIdProps(
                      'task-form-dialog-project-helper',
                    ),
                  }}
                >
                  {projects.map((project) => (
                    <MenuItem
                      key={project.id}
                      value={project.id}
                      data-testid="task-form-dialog-project-option"
                    >
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
                  slotProps={{
                    select: {
                      SelectDisplayProps: testIdProps(
                        'task-form-dialog-status',
                      ),
                    },
                    formHelperText: testIdProps(
                      'task-form-dialog-status-helper',
                    ),
                  }}
                >
                  {availableColumns.map((column) => (
                    <MenuItem
                      key={column.id}
                      value={column.id}
                      data-testid="task-form-dialog-status-option"
                    >
                      {column.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AssigneeSelect control={control} users={users} />
            <PrioritySelect control={control} />
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
                slotProps={{
                  htmlInput: testIdProps('task-form-dialog-description'),
                  formHelperText: testIdProps(
                    'task-form-dialog-description-helper',
                  ),
                }}
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
                    slotProps={{
                      htmlInput: testIdProps('task-form-dialog-due-date'),
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
              <FavoriteSwitchField control={control} />
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
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 120 }}
          data-testid="task-form-dialog-cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="task-form"
          variant="contained"
          sx={{ minWidth: 120 }}
          data-testid="task-form-dialog-submit"
        >
          Save Task
        </Button>
      </DialogActions>
    </Dialog>
  )
}
