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

// Header click cycles asc → desc → off (back to the incoming order).
export function nextSort(current: SortState, key: SortKey): SortState {
  if (current?.key !== key) return { key, dir: 'asc' }
  if (current.dir === 'asc') return { key, dir: 'desc' }
  return null
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
