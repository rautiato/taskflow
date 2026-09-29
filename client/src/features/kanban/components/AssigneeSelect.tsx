import type { Control } from 'react-hook-form'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { UserAvatar } from '../../../components/UserAvatar'
import { FormSingleSelect } from '../../../components/FormSingleSelect'
import type { UserDto } from '../../../models/user'
import { UNASSIGNED, type TaskFormValues } from '../taskFormSchema'

export function AssigneeSelect({
  control,
  users,
}: {
  control: Control<TaskFormValues>
  users: UserDto[]
}) {
  return (
    <FormSingleSelect<TaskFormValues>
      name="assigneeId"
      control={control}
      label="Assignee"
      fullWidth
      testId="assignee-select"
      renderValue={(value) => {
        const selected = users.find((u) => u.id === value)
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserAvatar
              id={selected?.id}
              name={selected?.name ?? null}
              avatarUrl={selected?.avatarUrl}
              size="xs"
            />
            {selected?.name ?? 'Unassigned'}
          </Box>
        )
      }}
    >
      <MenuItem
        value={UNASSIGNED}
        data-testid="assignee-select-option-unassigned"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <UserAvatar name={null} size="xs" />
          Unassigned
        </Box>
      </MenuItem>
      {users.map((user) => (
        <MenuItem
          key={user.id}
          value={user.id}
          data-testid="assignee-select-option"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
    </FormSingleSelect>
  )
}
