import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { testIdProps } from '../../../utils/testIdProps'

export function NewProjectDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}) {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  function handleClose() {
    setName('')
    onClose()
  }

  function handleCreate() {
    if (!trimmed) return
    onCreate(trimmed)
    setName('')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: testIdProps('new-project-dialog') }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        New Project
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close"
          data-testid="new-project-dialog-close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Project Name"
          required
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleCreate()
            }
          }}
          slotProps={{ htmlInput: testIdProps('new-project-dialog-name') }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ minWidth: 120 }}
          data-testid="new-project-dialog-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!trimmed}
          sx={{ minWidth: 120 }}
          data-testid="new-project-dialog-submit"
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  )
}
