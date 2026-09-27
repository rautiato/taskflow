import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableSortLabel from '@mui/material/TableSortLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { UserAvatar } from '../../../components/UserAvatar'
import { PRIORITY_STYLES, getDueChip } from '../../tasks/taskDisplay'
import { PRIORITY_RANK } from '../../tasks/sortTasks'
import {
  nextSort,
  type SortKey,
  type SortState,
} from '../../tasks/taskListSort'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import { FavoriteToggle } from './FavoriteToggle'
import { TaskListCard } from './TaskListCard'

const BASE_COLUMN_TEMPLATE = '32px 2.2fr 0.9fr 0.9fr 0.9fr 0.9fr 1.3fr 84px'
const PROJECT_COLUMN_TEMPLATE =
  '32px 1.8fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 1.2fr 84px'
// Tablets can be narrower than the table; below these widths it scrolls
// sideways inside its own box. Phones get cards instead (see below).
const BASE_MIN_WIDTH = 900
const PROJECT_MIN_WIDTH = 1000

export function TaskListView({
  tasks,
  columns,
  users,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onToggleFavorite,
  projectNameByColumnId,
  sort: sortProp,
  onSortChange,
}: {
  tasks: TaskItem[]
  columns: KanbanColumn[]
  users: UserDto[]
  onTaskClick: (task: TaskItem) => void
  onTaskEdit: (task: TaskItem) => void
  onTaskDelete: (task: TaskItem) => void
  onToggleFavorite: (task: TaskItem) => void
  projectNameByColumnId?: Record<string, string>
  // Pass both to let the page own the sort (e.g. keep it in the URL);
  // omit them and the list keeps its own sort state.
  sort?: SortState
  onSortChange?: (sort: SortState) => void
}) {
  const [localSort, setLocalSort] = useState<SortState>(null)
  const sort = sortProp !== undefined ? sortProp : localSort
  const setSort = onSortChange ?? setLocalSort
  // Phones get one card per task instead of the table; the cards follow
  // the same sort, there's just no header to change it from.
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const columnById = new Map(columns.map((c) => [c.id, c]))
  const userById = new Map(users.map((u) => [u.id, u]))

  function toggleSort(key: SortKey) {
    setSort(nextSort(sort, key))
  }

  function compare(a: TaskItem, b: TaskItem, key: SortKey): number {
    switch (key) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'project':
        return (projectNameByColumnId?.[a.columnId] ?? '').localeCompare(
          projectNameByColumnId?.[b.columnId] ?? '',
        )
      case 'priority':
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
      case 'status':
        return (
          (columnById.get(a.columnId)?.order ?? 0) -
          (columnById.get(b.columnId)?.order ?? 0)
        )
      case 'assignee':
        return (
          userById.get(a.assigneeId ?? '')?.name ?? 'Unassigned'
        ).localeCompare(userById.get(b.assigneeId ?? '')?.name ?? 'Unassigned')
      case 'createdBy':
        return (
          userById.get(a.createdById ?? '')?.name ?? 'Unknown'
        ).localeCompare(userById.get(b.createdById ?? '')?.name ?? 'Unknown')
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
  }

  // Pinned tasks stay on top under any header sort; the chosen sort orders
  // the pinned and unpinned groups among themselves.
  const displayedTasks = sort
    ? [...tasks].sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
        return (sort.dir === 'asc' ? 1 : -1) * compare(a, b, sort.key)
      })
    : tasks

  const columnTemplate = projectNameByColumnId
    ? PROJECT_COLUMN_TEMPLATE
    : BASE_COLUMN_TEMPLATE

  const headerColumns: { key: SortKey; label: string }[] = [
    { key: 'title', label: 'Task' },
    ...(projectNameByColumnId
      ? [{ key: 'project' as const, label: 'Project' }]
      : []),
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'dueDate', label: 'Due Date' },
  ]

  const emptyMessage = (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        No tasks match these filters.
      </Typography>
    </Box>
  )

  if (isPhone) {
    return (
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {displayedTasks.length === 0
          ? emptyMessage
          : displayedTasks.map((task) => {
              const column = columnById.get(task.columnId)
              return (
                <TaskListCard
                  key={task.id}
                  task={task}
                  isDone={column?.isDone ?? false}
                  statusName={column?.name ?? 'Unknown'}
                  assignee={
                    task.assigneeId ? userById.get(task.assigneeId) : undefined
                  }
                  projectName={projectNameByColumnId?.[task.columnId]}
                  onClick={() => onTaskClick(task)}
                  onEdit={() => onTaskEdit(task)}
                  onDelete={() => onTaskDelete(task)}
                  onToggleFavorite={() => onToggleFavorite(task)}
                />
              )
            })}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        overflowX: 'auto',
      }}
    >
      <Box
        sx={{
          minWidth: projectNameByColumnId ? PROJECT_MIN_WIDTH : BASE_MIN_WIDTH,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: columnTemplate,
            gap: 1,
            px: 2,
            py: 1,
            bgcolor: '#F5F6F8',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box />
          {headerColumns.map(({ key, label }) => (
            <TableSortLabel
              key={key}
              active={sort?.key === key}
              direction={sort?.key === key ? sort.dir : 'asc'}
              onClick={() => toggleSort(key)}
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                '&.Mui-active': { color: 'text.primary' },
              }}
            >
              {label}
            </TableSortLabel>
          ))}
          <Box />
        </Box>

        {displayedTasks.length === 0
          ? emptyMessage
          : displayedTasks.map((task) => {
              const column = columnById.get(task.columnId)
              const assignee = task.assigneeId
                ? userById.get(task.assigneeId)
                : undefined
              const creator = task.createdById
                ? userById.get(task.createdById)
                : undefined
              const isDone = column?.isDone ?? false
              const priorityStyle = PRIORITY_STYLES[task.priority]
              const dueChip = getDueChip(task, isDone)

              return (
                <Box
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: columnTemplate,
                    gap: 1,
                    alignItems: 'center',
                    px: 2,
                    py: 1.25,
                    borderBottom: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:last-of-type': { borderBottom: 0 },
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:hover .row-actions': { opacity: 1 },
                  }}
                >
                  <FavoriteToggle
                    isFavorite={task.isFavorite}
                    onToggle={() => onToggleFavorite(task)}
                    size={18}
                  />
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      ...(isDone && {
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }),
                    }}
                  >
                    {task.title}
                  </Typography>
                  {projectNameByColumnId && (
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                      {projectNameByColumnId[task.columnId] ?? 'Unknown'}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      ...priorityStyle,
                      fontSize: 11,
                      fontWeight: 700,
                      px: 1,
                      py: 0.25,
                      borderRadius: 999,
                      width: 'fit-content',
                    }}
                  >
                    {task.priority}
                  </Box>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {column?.name ?? 'Unknown'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UserAvatar
                      id={assignee?.id}
                      name={assignee?.name ?? null}
                      avatarUrl={assignee?.avatarUrl}
                      size="xs"
                    />
                    <Typography sx={{ fontSize: 13 }}>
                      {assignee?.name ?? 'Unassigned'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UserAvatar
                      id={creator?.id}
                      name={creator?.name ?? null}
                      avatarUrl={creator?.avatarUrl}
                      size="xs"
                    />
                    <Typography sx={{ fontSize: 13 }}>
                      {creator?.name ?? 'Unknown'}
                    </Typography>
                  </Box>
                  {dueChip ? (
                    <Box
                      sx={{
                        ...dueChip.sx,
                        fontSize: 11,
                        fontWeight: 600,
                        px: 1,
                        py: 0.25,
                        borderRadius: 999,
                        width: 'fit-content',
                      }}
                    >
                      {dueChip.label}
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
                      —
                    </Typography>
                  )}
                  <Box
                    className="row-actions"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      opacity: 0,
                      transition: 'opacity 0.15s ease',
                      // Touch screens can't hover, so keep the actions visible.
                      '@media (hover: none)': { opacity: 1 },
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskEdit(task)
                      }}
                      sx={{ p: 0.75 }}
                    >
                      <EditIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskDelete(task)
                      }}
                      sx={{ p: 0.75 }}
                    >
                      <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    </IconButton>
                  </Box>
                </Box>
              )
            })}
      </Box>
    </Box>
  )
}
