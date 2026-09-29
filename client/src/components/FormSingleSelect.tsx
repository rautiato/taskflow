import type { ReactNode } from 'react'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { testIdProps } from '../utils/testIdProps'

// A single-choice MUI select wired to a react-hook-form field. Options come
// in as MenuItem children; the test ID goes on the box users click to open it.
export function FormSingleSelect<T extends FieldValues>({
  name,
  control,
  testId,
  helperText,
  renderValue,
  children,
  ...props
}: Omit<
  TextFieldProps,
  | 'name'
  | 'value'
  | 'onChange'
  | 'onBlur'
  | 'error'
  | 'select'
  | 'slotProps'
  | 'children'
> & {
  name: Path<T>
  control: Control<T>
  testId: string
  // How the chosen value shows in the closed box (e.g. an avatar + name).
  renderValue?: (value: unknown) => ReactNode
  children: ReactNode
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          select
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? helperText}
          slotProps={{
            select: { renderValue, SelectDisplayProps: testIdProps(testId) },
            formHelperText: testIdProps(`${testId}-helper`),
          }}
        >
          {children}
        </TextField>
      )}
    />
  )
}
