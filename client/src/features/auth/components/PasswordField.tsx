import { useState } from 'react'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export function PasswordField<T extends FieldValues>({
  name,
  control,
  label = 'Password',
  hint,
}: {
  name: Path<T>
  control: Control<T>
  label?: string
  hint?: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          type={showPassword ? 'text' : 'password'}
          required
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? hint}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  )
}
