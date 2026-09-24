import { useState } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { KanbanColumn } from '../../../models/kanbanBoard'

export function AddColumnMenu({
  anchorEl,
  open,
  onClose,
  columns,
  taskCountByColumn,
  onHide,
  onShow,
  onDelete,
  onCreate,
}: {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  columns: KanbanColumn[]
  taskCountByColumn: Record<string, number>
  onHide: (columnId: string) => void
  onShow: (columnId: string) => void
  onDelete: (columnId: string) => void
  onCreate: (name: string) => void
}) {
  const [newColumnName, setNewColumnName] = useState('')

  const shownColumns = columns.filter((c) => c.isVisible)
  const hiddenColumns = columns.filter((c) => !c.isVisible)
  const trimmedName = newColumnName.trim()
  const isDuplicate = columns.some(
    (c) => c.name.toLowerCase() === trimmedName.toLowerCase(),
  )

  function handleClose() {
    setNewColumnName('')
    onClose()
  }

  function handleCreate() {
    if (!trimmedName || isDuplicate) return
    onCreate(trimmedName)
    setNewColumnName('')
  }

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          width: 300,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
          Board columns
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          Empty columns can be hidden or deleted — the last visible one always
          stays.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            Shown on this board
          </Typography>

          {shownColumns.map((column) => {
            const hasTasks = (taskCountByColumn[column.id] ?? 0) > 0
            const isLastVisible = shownColumns.length <= 1
            const disabledReason = hasTasks
              ? 'Move or delete its tasks first.'
              : isLastVisible
                ? 'A board needs at least one visible column.'
                : undefined
            const actionsDisabled = hasTasks || isLastVisible
            return (
              <Box
                key={column.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ fontSize: 13 }}>{column.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    size="small"
                    disabled={actionsDisabled}
                    onClick={() => onHide(column.id)}
                    title={disabledReason}
                  >
                    Hide
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    disabled={actionsDisabled}
                    onClick={() => onDelete(column.id)}
                    title={disabledReason}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            )
          })}
        </Box>

        {hiddenColumns.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              Available to add
            </Typography>
            {hiddenColumns.map((column) => (
              <Box
                key={column.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ fontSize: 13 }}>{column.name}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" onClick={() => onShow(column.id)}>
                    + Add
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(column.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
            }}
          >
            Or create a new column
          </Typography>
          <TextField
            size="small"
            placeholder="Column name"
            fullWidth
            value={newColumnName}
            onChange={(event) => setNewColumnName(event.target.value)}
            error={isDuplicate}
            helperText={
              isDuplicate ? 'A column with this name already exists.' : ' '
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleCreate()
              }
            }}
          />
          <Button
            variant="contained"
            disabled={!trimmedName || isDuplicate}
            onClick={handleCreate}
          >
            Add Column
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}
