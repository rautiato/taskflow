import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { emailSchema, nameSchema } from '../validation'
import { authService } from '../authService'
import { AvatarUpload } from '../../../components/AvatarUpload'
import type { UserDto } from '../../../models/user'

const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm({
  user,
  onUpdated,
}: {
  user: UserDto
  onUpdated: (user: UserDto) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email },
  })

  function onSubmit(values: ProfileFormValues) {
    setError(null)
    setSuccess(false)
    try {
      onUpdated(authService.updateProfile(user.id, values))
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update profile.',
      )
    }
  }

  function handleAvatarChange(avatarUrl: string | null) {
    setError(null)
    try {
      onUpdated(authService.updateAvatar(user.id, avatarUrl))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update photo.')
    }
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Stack
      spacing={2.5}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Profile updated.</Alert>}

      <AvatarUpload
        id={user.id}
        name={user.name}
        avatarUrl={user.avatarUrl}
        onChange={handleAvatarChange}
      />

      <Divider />

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Name"
            required
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            required
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        Role: {user.role} · Member since {memberSince}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" variant="contained" disabled={!isDirty}>
          Save changes
        </Button>
      </Box>
    </Stack>
  )
}
