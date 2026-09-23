import { useState, type KeyboardEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { SxProps, Theme } from '@mui/material/styles'
import type { KanbanColumn } from '../../../models/kanbanBoard'

import { TaskCard } from './TaskCard'
import { COLUMN_WIDTH } from './ColumnHeaderRow'
import type { AssigneeLaneData } from '../../tasks/groupTasksByAssignee'

const AVATAR_COLORS = ['primary', 'success', 'warning', 'error'] as const

const styles = {
  root: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.25,
    bgcolor: 'background.paper',
    p: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  header: {
    bgcolor: '#F0F1F4',
    borderRadius: 1,
    px: 1.5,
    py: 0.875,
    display: 'flex',
    alignItems: 'center',
    gap: 1.125,
    cursor: 'pointer',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
  },
  name: {
    fontSize: 13,
    fontWeight: 700,
  },
  countChip: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 999,
    px: 1,
    fontSize: 11,
    fontWeight: 600,
    color: 'text.secondary',
  },
  collapseIcon: {
    fontSize: 18,
    color: 'text.secondary',
    ml: 'auto',
    transition: 'transform 0.15s ease',
  },
  columnsRow: {
    display: 'flex',
    gap: 2,
  },
  columnCell: {
    width: COLUMN_WIDTH,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  },
} satisfies Record<string, SxProps<Theme>>

export function AssigneeLane({
  lane,
  columns,
  colorIndex,
}: {
  lane: AssigneeLaneData
  columns: KanbanColumn[]
  colorIndex: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]
  const initials = lane.assigneeName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const toggleCollapsed = () => setCollapsed((c) => !c)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleCollapsed()
    }
  }

  return (
    <Box sx={styles.root}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        aria-label={`${lane.assigneeName} lane, ${collapsed ? 'collapsed' : 'expanded'}`}
        onClick={toggleCollapsed}
        onKeyDown={handleKeyDown}
        sx={styles.header}
      >
        <Box
          sx={[
            styles.avatar,
            {
              bgcolor: lane.assigneeId ? `${color}.light` : '#EEF0F2',
              color: lane.assigneeId ? `${color}.main` : 'text.secondary',
            },
          ]}
        >
          {initials}
        </Box>
        <Typography sx={styles.name}>{lane.assigneeName}</Typography>
        <Box sx={styles.countChip}>{lane.taskCount} tasks</Box>
        <ExpandMoreIcon
          sx={[
            styles.collapseIcon,
            { transform: collapsed ? 'rotate(-90deg)' : 'none' },
          ]}
        />
      </Box>
      {!collapsed && (
        <Box sx={styles.columnsRow}>
          {columns.map((column) => (
            <Box key={column.id} sx={styles.columnCell}>
              {(lane.tasksByColumn[column.id] ?? []).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isDoneColumn={column.name === 'Done'}
                />
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
