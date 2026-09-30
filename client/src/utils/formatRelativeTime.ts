export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  // ms → minutes (60 s × 1000 ms).
  const diffMin = Math.round(diffMs / (60 * 1000))
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
