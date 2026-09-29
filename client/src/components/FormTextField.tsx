import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { testIdProps } from '../utils/testIdProps'

// A MUI TextField wired to a react-hook-form field: value, validation error
// and test IDs come from here, so each form only sets what's different.
export function FormTextField<T extends FieldValues>({
  name,
  control,
  testId,
  helperText,
  slotProps,
  ...props
}: Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error'> & {
  name: Path<T>
  control: Control<T>
  testId: string
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          error={!!fieldState.error}
          // A validation error replaces the hint while it's showing.
          helperText={fieldState.error?.message ?? helperText}
          slotProps={{
            ...slotProps,
            htmlInput: testIdProps(testId),
            formHelperText: testIdProps(`${testId}-helper`),
          }}
        />
      )}
    />
  )
}
