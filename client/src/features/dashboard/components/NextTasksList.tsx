import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import type { SxProps, Theme } from '@mui/material/styles'
import type { TaskItem } from '../../../models/task'
import { getDueChip, PRIORITY_STYLES } from '../../tasks/taskDisplay'

export type NextTaskItem = { task: TaskItem; projectName: string; href: string }

const styles = {
  root: {
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden',
  },
  // Same tint as the task lists' column-header row, so the heading reads
  // as a header rather than another task row.
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 2.25,
    py: 1.75,
    bgcolor: '#F5F6F8',
    borderBottom: 1,
    borderColor: 'divider',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    color: 'text.secondary',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    px: 2.25,
    py: 1.25,
    color: 'inherit',
    textDecoration: 'none',
    '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' },
    '&:hover': { bgcolor: 'action.hover' },
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  project: {
    fontSize: 12,
    color: 'text.secondary',
  },
  chip: {
    fontSize: 11,
    fontWeight: 700,
    px: 1,
    py: 0.25,
    borderRadius: 1,
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, SxProps<Theme>>

export function NextTasksList({
  items,
  empty,
  viewAllHref,
}: {
  items: NextTaskItem[]
  empty: ReactNode
  viewAllHref: string
}) {
  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Box>
          <Typography sx={styles.title}>Your next tasks</Typography>
          <Typography sx={styles.subtitle}>
            Open tasks assigned to you, soonest due first
          </Typography>
        </Box>
        <Link
          component={RouterLink}
          to={viewAllHref}
          underline="hover"
          sx={{ fontSize: 13, fontWeight: 600 }}
        >
          View all
        </Link>
      </Box>
      {items.length === 0
        ? empty
        : items.map(({ task, projectName, href }) => {
            const due = getDueChip(task, false)
            return (
              <Box
                key={task.id}
                component={RouterLink}
                to={href}
                sx={styles.row}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={styles.taskTitle}>
                    {task.title}
                  </Typography>
                  <Typography sx={styles.project}>{projectName}</Typography>
                </Box>
                <Box sx={[styles.chip, PRIORITY_STYLES[task.priority]]}>
                  {task.priority}
                </Box>
                {due && <Box sx={[styles.chip, due.sx]}>{due.label}</Box>}
              </Box>
            )
          })}
    </Box>
  )
}
