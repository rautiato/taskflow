import type { Control } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import type { SxProps, Theme } from '@mui/material/styles'
import type { TaskPriority } from '../../../models/task'
import type { TaskFormValues } from '../taskFormSchema'
import { FormSingleSelect } from '../../../components/FormSingleSelect'
import { PriorityChip } from './PriorityChip'

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High']

const styles = {
  chip: {
    fontSize: 12,
  },
} satisfies Record<string, SxProps<Theme>>

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
        <PriorityChip priority={value as TaskPriority} sx={styles.chip} />
      )}
    >
      {PRIORITY_OPTIONS.map((priority) => (
        <MenuItem
          key={priority}
          value={priority}
          data-testid={`priority-select-option-${priority.toLowerCase()}`}
        >
          <PriorityChip priority={priority} sx={styles.chip} />
        </MenuItem>
      ))}
    </FormSingleSelect>
  )
}
