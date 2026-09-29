import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import { testIdProps } from '../../../utils/testIdProps'

export function EmailField<T extends FieldValues>({
  control,
  name = 'email' as Path<T>,
  testId,
}: {
  control: Control<T>
  name?: Path<T>
  testId: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label="Email"
          type="email"
          required
          fullWidth
          placeholder="you@example.com"
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={{
            htmlInput: testIdProps(testId),
            formHelperText: testIdProps(`${testId}-helper`),
          }}
        />
      )}
    />
  )
}
