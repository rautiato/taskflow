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
    gap: 2,
    px: 2.25,
    py: 1.75,
    bgcolor: 'background.subtle',
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
  // Phones: title above the chips. Wider screens: one row.
  row: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: { xs: 0.75, sm: 1.5 },
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
  chips: {
    display: 'flex',
    gap: 1.5,
    flexShrink: 0,
  },
  chip: {
    fontSize: 11,
    fontWeight: 700,
    px: 1,
    py: 0.25,
    borderRadius: 1,
    whiteSpace: 'nowrap',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: 600,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
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
    <Box sx={styles.root} data-testid="next-tasks-list">
      <Box sx={styles.header}>
        <Box>
          <Typography sx={styles.title} data-testid="next-tasks-list-title">
            Your next tasks
          </Typography>
          <Typography
            sx={styles.subtitle}
            data-testid="next-tasks-list-subtitle"
          >
            Open tasks assigned to you in active projects, soonest due first
          </Typography>
        </Box>
        <Link
          component={RouterLink}
          to={viewAllHref}
          sx={styles.viewAll}
          data-testid="next-tasks-list-view-all"
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
                data-testid="next-tasks-list-item"
              >
                <Box sx={styles.rowText}>
                  <Typography
                    noWrap
                    sx={styles.taskTitle}
                    data-testid="next-tasks-list-item-title"
                  >
                    {task.title}
                  </Typography>
                  <Typography
                    sx={styles.project}
                    data-testid="next-tasks-list-item-project"
                  >
                    {projectName}
                  </Typography>
                </Box>
                <Box sx={styles.chips}>
                  <Box
                    sx={[styles.chip, PRIORITY_STYLES[task.priority]]}
                    data-testid="next-tasks-list-item-priority"
                  >
                    {task.priority}
                  </Box>
                  {due && (
                    <Box
                      sx={[styles.chip, due.sx]}
                      data-testid="next-tasks-list-item-due"
                    >
                      {due.label}
                    </Box>
                  )}
                </Box>
              </Box>
            )
          })}
    </Box>
  )
}
