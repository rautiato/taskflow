import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import { getDueChip } from '../../tasks/taskDisplay'
import { UserAvatar } from '../../../components/UserAvatar'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { PriorityChip } from './PriorityChip'

const styles = {
  metaTable: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  metaRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    alignItems: 'center',
    gap: 1,
    px: 2,
    py: 1.25,
    borderBottom: 1,
    borderColor: 'divider',
    '&:last-of-type': { borderBottom: 0 },
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
  },
  metaValue: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  metaText: {
    fontSize: 13,
    fontWeight: 600,
  },
  priorityChip: {
    px: 1.25,
  },
  dueIcon: {
    fontSize: 15,
  },
  noDueDate: {
    fontSize: 13,
    color: 'text.disabled',
  },
} satisfies Record<string, SxProps<Theme>>

function MetaRow({
  label,
  testId,
  children,
}: {
  label: string
  testId: string
  children: ReactNode
}) {
  return (
    <Box sx={styles.metaRow}>
      <Typography sx={styles.label}>{label}</Typography>
      <Box sx={styles.metaValue} data-testid={testId}>
        {children}
      </Box>
    </Box>
  )
}

export function TaskDetailMeta({
  task,
  column,
  assignee,
  creator,
}: {
  task: TaskItem
  column: KanbanColumn | undefined
  assignee: UserDto | undefined
  creator: UserDto | undefined
}) {
  const dueChip = getDueChip(task, column?.isDone ?? false)

  return (
    <Box sx={styles.metaTable}>
      <MetaRow label="Status" testId="task-detail-drawer-status">
        <Typography sx={styles.metaText}>
          {column?.name ?? 'Unknown'}
        </Typography>
      </MetaRow>
      <MetaRow label="Priority" testId="task-detail-drawer-priority">
        <PriorityChip priority={task.priority} sx={styles.priorityChip} />
      </MetaRow>
      <MetaRow label="Assignee" testId="task-detail-drawer-assignee">
        <UserAvatar
          id={assignee?.id}
          name={assignee?.name ?? null}
          avatarUrl={assignee?.avatarUrl}
          size="xs"
        />
        <Typography sx={styles.metaText}>
          {assignee?.name ?? 'Unassigned'}
        </Typography>
      </MetaRow>
      <MetaRow label="Created By" testId="task-detail-drawer-creator">
        <UserAvatar
          id={creator?.id}
          name={creator?.name ?? null}
          avatarUrl={creator?.avatarUrl}
          size="xs"
        />
        <Typography sx={styles.metaText}>
          {creator?.name ?? 'Unknown'}
        </Typography>
      </MetaRow>
      <MetaRow label="Due Date" testId="task-detail-drawer-due-date">
        {dueChip ? (
          <>
            <CalendarTodayOutlinedIcon
              sx={[styles.dueIcon, { color: dueChip.sx.color }]}
            />
            <Typography sx={[styles.metaText, { color: dueChip.sx.color }]}>
              {dueChip.label}
            </Typography>
          </>
        ) : (
          <Typography sx={styles.noDueDate}>No due date</Typography>
        )}
      </MetaRow>
    </Box>
  )
}
