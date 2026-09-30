import { useState } from 'react'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import { testIdProps } from '../../../utils/testIdProps'

const styles = {
  root: {
    width: 300,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
  },
  hint: {
    fontSize: 12,
    color: 'text.secondary',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
  },
  columnRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  columnName: {
    fontSize: 13,
  },
  columnActions: {
    display: 'flex',
    gap: 0.5,
  },
} satisfies Record<string, SxProps<Theme>>

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
      slotProps={{ paper: testIdProps('add-column-menu') }}
    >
      <Box sx={styles.root}>
        <Typography sx={styles.title}>Manage Columns</Typography>
        <Typography sx={styles.hint}>
          Only empty columns can be hidden or deleted. Done always stays.
        </Typography>

        <Box sx={styles.section}>
          <Typography sx={styles.sectionLabel}>Shown on this board</Typography>

          {shownColumns.map((column) => {
            const hasTasks = (taskCountByColumn[column.id] ?? 0) > 0
            const disabledReason = hasTasks
              ? 'Move or delete its tasks first.'
              : undefined
            return (
              <Box
                key={column.id}
                data-testid="add-column-menu-shown-column"
                sx={styles.columnRow}
              >
                <Typography
                  sx={styles.columnName}
                  data-testid="add-column-menu-column-name"
                >
                  {column.name}
                </Typography>
                {!column.isDone && (
                  <Box sx={styles.columnActions}>
                    <Button
                      size="small"
                      disabled={hasTasks}
                      onClick={() => onHide(column.id)}
                      title={disabledReason}
                      data-testid="add-column-menu-hide"
                    >
                      Hide
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      disabled={hasTasks}
                      onClick={() => onDelete(column.id)}
                      title={disabledReason}
                      data-testid="add-column-menu-delete"
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>

        {hiddenColumns.length > 0 && (
          <Box sx={styles.section}>
            <Typography sx={styles.sectionLabel}>Available to add</Typography>
            {hiddenColumns.map((column) => (
              <Box
                key={column.id}
                data-testid="add-column-menu-hidden-column"
                sx={styles.columnRow}
              >
                <Typography
                  sx={styles.columnName}
                  data-testid="add-column-menu-column-name"
                >
                  {column.name}
                </Typography>
                <Box sx={styles.columnActions}>
                  <Button
                    size="small"
                    onClick={() => onShow(column.id)}
                    data-testid="add-column-menu-show"
                  >
                    Show
                  </Button>
                  {!column.isDone && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(column.id)}
                      data-testid="add-column-menu-delete"
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={styles.section}>
          <Typography sx={styles.sectionLabel}>
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
            slotProps={{
              htmlInput: testIdProps('add-column-menu-new-name'),
              formHelperText: testIdProps('add-column-menu-new-name-helper'),
            }}
          />
          <Button
            variant="contained"
            disabled={!trimmedName || isDuplicate}
            onClick={handleCreate}
            data-testid="add-column-menu-create"
          >
            Add Column
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}
