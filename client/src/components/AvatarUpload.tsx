import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import { UserAvatar } from './UserAvatar'
import { AvatarCropDialog } from './AvatarCropDialog'
import { MAX_ATTACHMENT_BYTES } from '../utils/fileToDataUrl'

export function AvatarUpload({
  id,
  name,
  avatarUrl,
  onChange,
}: {
  id: string
  name: string
  avatarUrl: string | null | undefined
  onChange: (avatarUrl: string | null) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null)

  function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setError('Image is over the 2 MB limit.')
      return
    }
    setPendingImageSrc(URL.createObjectURL(file))
  }

  function closeCropDialog() {
    if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc)
    setPendingImageSrc(null)
  }

  function handleCropSave(dataUrl: string) {
    onChange(dataUrl)
    closeCropDialog()
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="label"
          sx={{
            position: 'relative',
            display: 'inline-flex',
            cursor: 'pointer',
            borderRadius: '50%',
            '&:hover .avatar-upload-overlay': { opacity: 1 },
          }}
        >
          <UserAvatar id={id} name={name} avatarUrl={avatarUrl} size="lg" />
          <Box
            className="avatar-upload-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.45)',
              color: '#FFFFFF',
              opacity: 0,
              transition: 'opacity 0.15s ease',
            }}
          >
            <CameraAltOutlinedIcon fontSize="small" />
          </Box>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Link
              component="label"
              underline="hover"
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            >
              Change photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  handleFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </Link>
            {avatarUrl && (
              <Link
                component="button"
                type="button"
                underline="hover"
                color="error"
                sx={{ fontWeight: 600 }}
                onClick={() => onChange(null)}
              >
                Remove
              </Link>
            )}
          </Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>
            JPG or PNG, up to 2MB.
          </Typography>
          {error && (
            <Typography sx={{ fontSize: 12, color: 'error.main', mt: 0.5 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
      <AvatarCropDialog
        imageSrc={pendingImageSrc}
        onCancel={closeCropDialog}
        onSave={handleCropSave}
      />
    </>
  )
}
