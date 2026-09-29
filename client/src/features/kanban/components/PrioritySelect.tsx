import type { Control } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import type { TaskPriority } from '../../../models/task'
import type { TaskFormValues } from '../taskFormSchema'
import { FormSingleSelect } from '../../../components/FormSingleSelect'
import { PriorityChip } from './PriorityChip'

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']

export function PrioritySelect({
  control,
}: {
  control: Control<TaskFormValues>
}) {
  return (
    <FormSingleSelect<TaskFormValues>
      name="priority"
      control={control}
      label="Priority"
      fullWidth
      testId="priority-select"
      renderValue={(value) => (
        <PriorityChip priority={value as TaskPriority} sx={{ fontSize: 12 }} />
      )}
    >
      {PRIORITY_OPTIONS.map((priority) => (
        <MenuItem
          key={priority}
          value={priority}
          data-testid={`priority-select-option-${priority.toLowerCase()}`}
        >
          <PriorityChip priority={priority} sx={{ fontSize: 12 }} />
        </MenuItem>
      ))}
    </FormSingleSelect>
  )
}
