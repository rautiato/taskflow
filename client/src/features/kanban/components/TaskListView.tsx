import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableSortLabel from '@mui/material/TableSortLabel'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme, type SxProps, type Theme } from '@mui/material/styles'
import {
  nextSort,
  sortTaskList,
  type SortKey,
  type SortState,
} from '../../tasks/taskListSort'
import type { TaskItem } from '../../../models/task'
import type { KanbanColumn } from '../../../models/kanbanBoard'
import type { UserDto } from '../../../models/user'
import type { ProjectStatus } from '../../../models/project'
import { TaskListCard } from './TaskListCard'
import { TaskListRow } from './TaskListRow'

const BASE_COLUMN_TEMPLATE = '32px 2.2fr 0.9fr 0.9fr 0.9fr 0.9fr 1.3fr 84px'
// Project gets the room the Due date column doesn't need: due chips are
// short, but never narrower than the longest one ("Completed Sep 18, 2026").
const PROJECT_COLUMN_TEMPLATE =
  '32px 1.8fr 1.3fr 0.8fr 0.8fr 0.8fr 0.8fr minmax(130px, 0.9fr) 84px'
// A laptop window can be narrower than the table; below these widths it
// scrolls sideways inside its own box. Phones and tablets get cards
// instead (see below).
const BASE_MIN_WIDTH = 900
const PROJECT_MIN_WIDTH = 1000

const styles = {
  empty: {
    px: 2,
    py: 3,
  },
  cardList: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    bgcolor: 'background.paper',
    overflow: 'hidden',
  },
  table: {
    border: 1,
    borderColor: 'divider',
    borderRadius: 1.5,
    bgcolor: 'background.paper',
    overflowX: 'auto',
  },
  header: {
    display: 'grid',
    gap: 1,
    px: 2,
    py: 1,
    bgcolor: 'background.subtle',
    borderBottom: 1,
    borderColor: 'divider',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
    '&.Mui-active': { color: 'text.primary' },
  },
} satisfies Record<string, SxProps<Theme>>

const SORT_TEST_IDS: Record<SortKey, string> = {
  title: 'title',
  project: 'project',
  priority: 'priority',
  status: 'status',
  assignee: 'assignee',
  createdBy: 'created-by',
  dueDate: 'due-date',
}

export function TaskListView({
  tasks,
  columns,
  users,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onToggleFavorite,
  projectNameByColumnId,
  projectStatusByColumnId,
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
  // Marks rows whose project is closed; omit it to show no marks.
  projectStatusByColumnId?: Record<string, ProjectStatus>
  // Pass both to let the page own the sort (e.g. keep it in the URL);
  // omit them and the list keeps its own sort state.
  sort?: SortState
  onSortChange?: (sort: SortState) => void
}) {
  const [localSort, setLocalSort] = useState<SortState>(null)
  const sort = sortProp !== undefined ? sortProp : localSort
  const setSort = onSortChange ?? setLocalSort
  // Phones and tablets (below 900px) get one card per task instead of the
  // table, which needs more width than they have; the cards follow the
  // same sort, there's just no header to change it from.
  const theme = useTheme()
  const showCards = useMediaQuery(theme.breakpoints.down('md'))
  const columnById = new Map(columns.map((c) => [c.id, c]))
  const userById = new Map(users.map((u) => [u.id, u]))

  const displayedTasks = sortTaskList(tasks, sort, {
    columnById,
    userById,
    projectNameByColumnId,
  })

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
    <Box sx={styles.empty} data-testid="task-list-view-empty">
      <Typography variant="secondaryText">
        No tasks match these filters.
      </Typography>
    </Box>
  )

  if (showCards) {
    return (
      <Box data-testid="task-list-view" sx={styles.cardList}>
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
                  isProjectClosed={
                    projectStatusByColumnId?.[task.columnId] === 'Closed'
                  }
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
    <Box data-testid="task-list-view" sx={styles.table}>
      <Box
        sx={{
          minWidth: projectNameByColumnId ? PROJECT_MIN_WIDTH : BASE_MIN_WIDTH,
        }}
      >
        <Box
          data-testid="task-list-view-header"
          sx={[styles.header, { gridTemplateColumns: columnTemplate }]}
        >
          <Box />
          {headerColumns.map(({ key, label }) => (
            <TableSortLabel
              key={key}
              active={sort?.key === key}
              direction={sort?.key === key ? sort.dir : 'asc'}
              onClick={() => setSort(nextSort(sort, key))}
              data-testid={`task-list-view-sort-${SORT_TEST_IDS[key]}`}
              sx={styles.sortLabel}
            >
              {label}
            </TableSortLabel>
          ))}
          <Box />
        </Box>

        {displayedTasks.length === 0
          ? emptyMessage
          : displayedTasks.map((task) => (
              <TaskListRow
                key={task.id}
                task={task}
                column={columnById.get(task.columnId)}
                assignee={
                  task.assigneeId ? userById.get(task.assigneeId) : undefined
                }
                creator={
                  task.createdById ? userById.get(task.createdById) : undefined
                }
                projectName={
                  projectNameByColumnId
                    ? (projectNameByColumnId[task.columnId] ?? 'Unknown')
                    : undefined
                }
                isProjectClosed={
                  projectStatusByColumnId?.[task.columnId] === 'Closed'
                }
                columnTemplate={columnTemplate}
                onClick={() => onTaskClick(task)}
                onEdit={() => onTaskEdit(task)}
                onDelete={() => onTaskDelete(task)}
                onToggleFavorite={() => onToggleFavorite(task)}
              />
            ))}
      </Box>
    </Box>
  )
}
