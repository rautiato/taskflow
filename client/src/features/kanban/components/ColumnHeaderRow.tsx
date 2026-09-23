import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { KanbanColumn } from '../../../models/kanbanBoard'

export const COLUMN_WIDTH = 320

export function ColumnHeaderRow({
  columns,
  taskCountByColumn,
}: {
  columns: KanbanColumn[]
  taskCountByColumn: Record<string, number>
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 0.25,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {columns.map((column) => (
          <Box
            key={column.id}
            sx={{
              width: COLUMN_WIDTH,
              display: 'flex',
              alignItems: 'center',
              gap: 0.875,
            }}
          >
            <DragIndicatorIcon sx={{ fontSize: 16, color: '#B7BBC1' }} />
            <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
              {column.name}
            </Typography>
            <Box
              sx={{
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                borderRadius: 999,
                px: 1.125,
                fontSize: 11,
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {taskCountByColumn[column.id] ?? 0}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small" disabled sx={{ color: '#B7BBC1' }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" disabled sx={{ color: '#B7BBC1' }}>
              <MoreVertIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          border: '1px dashed #C7CBD1',
          borderRadius: 1,
          px: 1.625,
          py: 0.75,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: 'text.secondary',
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        <AddIcon sx={{ fontSize: 14 }} />
        Add Column
      </Box>
    </Box>
  )
}
