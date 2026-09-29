import { Controller, type Control } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { TaskFormValues } from '../taskFormSchema'
import { testIdProps } from '../../../utils/testIdProps'

// A switch drawn as an outlined field, so it lines up with the Deadline
// field next to it in the task form.
export function FavoriteSwitchField({
  control,
}: {
  control: Control<TaskFormValues>
}) {
  return (
    <Box sx={{ position: 'relative' }} data-testid="favorite-switch-field">
      <Typography
        sx={{
          position: 'absolute',
          top: -8,
          left: 10,
          px: 0.5,
          bgcolor: 'background.paper',
          fontSize: 12,
          color: 'text.secondary',
          lineHeight: 1,
        }}
      >
        Favorite
      </Typography>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          px: 1.5,
          // Fixed to match the outlined TextField's own default
          // rendered height (56px) — the Switch's intrinsic size
          // is taller than a text input's line height, so padding
          // alone kept overshooting it.
          height: 56,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Controller
          name="isFavorite"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  slotProps={{
                    input: testIdProps('favorite-switch-field-input'),
                  }}
                />
              }
              label="Pin to top"
              sx={{ whiteSpace: 'nowrap', mx: 0 }}
            />
          )}
        />
      </Box>
    </Box>
  )
}
