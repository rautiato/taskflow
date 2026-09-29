import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { emailSchema, nameSchema } from '../validation'
import { EmailField } from './EmailField'
import { authService } from '../authService'
import { errorMessage } from '../../../utils/errorMessage'
import { FormTextField } from '../../../components/FormTextField'
import { AvatarUpload } from '../../../components/AvatarUpload'
import type { UserDto } from '../../../models/user'

const profileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

type ProfileFormValues = z.infer<typeof profileSchema>

const styles = {
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
} satisfies Record<string, SxProps<Theme>>

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
      setError(errorMessage(err, 'Unable to update profile.'))
    }
  }

  function handleAvatarChange(avatarUrl: string | null) {
    setError(null)
    try {
      onUpdated(authService.updateAvatar(user.id, avatarUrl))
    } catch (err) {
      setError(errorMessage(err, 'Unable to update photo.'))
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
      data-testid="profile-form"
    >
      {error && (
        <Alert severity="error" data-testid="profile-form-error">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" data-testid="profile-form-success">
          Profile updated.
        </Alert>
      )}

      <AvatarUpload
        id={user.id}
        name={user.name}
        avatarUrl={user.avatarUrl}
        onChange={handleAvatarChange}
      />

      <Divider />

      <FormTextField<ProfileFormValues>
        name="name"
        control={control}
        label="Name"
        required
        fullWidth
        testId="profile-form-name"
      />

      <EmailField<ProfileFormValues>
        control={control}
        testId="profile-form-email"
      />

      <Typography variant="secondaryText" data-testid="profile-form-meta">
        Role: {user.role} · Member since {memberSince}
      </Typography>

      <Box sx={styles.actions}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isDirty}
          data-testid="profile-form-submit"
        >
          Save changes
        </Button>
      </Box>
    </Stack>
  )
}
