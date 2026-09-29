import { useState } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormTextField } from '../../../components/FormTextField'

export function PasswordField<T extends FieldValues>({
  name,
  control,
  label = 'Password',
  hint,
  testId,
}: {
  name: Path<T>
  control: Control<T>
  label?: string
  hint?: string
  testId: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormTextField<T>
      name={name}
      control={control}
      label={label}
      type={showPassword ? 'text' : 'password'}
      required
      fullWidth
      helperText={hint}
      testId={testId}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid={`${testId}-visibility`}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
