import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import TextField from '@mui/material/TextField'

export function EmailField<T extends FieldValues>({
  control,
  name = 'email' as Path<T>,
}: {
  control: Control<T>
  name?: Path<T>
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
        />
      )}
    />
  )
}
