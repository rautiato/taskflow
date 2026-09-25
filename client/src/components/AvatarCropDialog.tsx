import { useCallback, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { cropImageToDataUrl } from '../utils/cropImageToDataUrl'

export function AvatarCropDialog({
  imageSrc,
  onCancel,
  onSave,
}: {
  imageSrc: string | null
  onCancel: () => void
  onSave: (dataUrl: string) => void
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return
    setIsSaving(true)
    try {
      onSave(await cropImageToDataUrl(imageSrc, croppedAreaPixels))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={!!imageSrc} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Crop your photo</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 280,
            bgcolor: '#111',
            borderRadius: 1,
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5 }}>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            onChange={(_, value) => setZoom(value as number)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || !croppedAreaPixels}
          sx={{ minWidth: 100 }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
