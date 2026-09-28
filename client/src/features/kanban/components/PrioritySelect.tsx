import { Controller, type Control } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import type { TaskPriority } from '../../../models/task'
import type { TaskFormValues } from '../taskFormSchema'
import { PriorityChip } from './PriorityChip'

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']

export function PrioritySelect({
  control,
}: {
  control: Control<TaskFormValues>
}) {
  return (
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
                <PriorityChip
                  priority={value as TaskPriority}
                  sx={{ fontSize: 12 }}
                />
              ),
            },
          }}
        >
          {PRIORITY_OPTIONS.map((priority) => (
            <MenuItem key={priority} value={priority}>
              <PriorityChip priority={priority} sx={{ fontSize: 12 }} />
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
