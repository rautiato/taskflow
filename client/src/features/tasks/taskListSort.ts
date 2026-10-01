import type { TaskItem } from '../../models/task'
import type { KanbanColumn } from '../../models/kanbanBoard'
import type { UserDto } from '../../models/user'
import { PRIORITY_RANK } from './sortTasks'

export type SortKey =
  | 'title'
  | 'project'
  | 'priority'
  | 'status'
  | 'assignee'
  | 'createdBy'
  | 'dueDate'
export type SortState = { key: SortKey; dir: 'asc' | 'desc' } | null

const SORT_KEYS: SortKey[] = [
  'title',
  'project',
  'priority',
  'status',
  'assignee',
  'createdBy',
  'dueDate',
]

/** Header click cycles asc → desc → off (back to the incoming order). */
export function nextSort(current: SortState, key: SortKey): SortState {
  if (current?.key !== key) return { key, dir: 'asc' }
  if (current.dir === 'asc') return { key, dir: 'desc' }
  return null
}

export type SortLookups = {
  columnById: Map<string, KanbanColumn>
  userById: Map<string, UserDto>
  projectNameByColumnId?: Record<string, string>
}

function compareBy(
  a: TaskItem,
  b: TaskItem,
  key: SortKey,
  { columnById, userById, projectNameByColumnId }: SortLookups,
): number {
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
      // YYYY-MM-DD strings sort correctly as text.
      return a.dueDate.localeCompare(b.dueDate)
  }
}

/**
 * Orders the task list by a header sort. Pinned tasks stay on top under any
 * sort; the sort orders the pinned and unpinned groups among themselves.
 * With no sort, returns `tasks` unchanged.
 */
export function sortTaskList(
  tasks: TaskItem[],
  sort: SortState,
  lookups: SortLookups,
): TaskItem[] {
  if (!sort) return tasks
  return [...tasks].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
    return (sort.dir === 'asc' ? 1 : -1) * compareBy(a, b, sort.key, lookups)
  })
}

export function sortFromSearchParams(params: URLSearchParams): SortState {
  const key = params.get('sort') as SortKey | null
  if (!key || !SORT_KEYS.includes(key)) return null
  return { key, dir: params.get('dir') === 'desc' ? 'desc' : 'asc' }
}

export function writeSortToSearchParams(
  params: URLSearchParams,
  sort: SortState,
): void {
  params.delete('sort')
  params.delete('dir')
  if (sort) {
    params.set('sort', sort.key)
    if (sort.dir === 'desc') params.set('dir', 'desc')
  }
}
