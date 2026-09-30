import Typography from '@mui/material/Typography'

export function TaskResultCount({
  count,
  testId,
}: {
  count: number
  testId: string
}) {
  return (
    <Typography variant="secondaryText" data-testid={testId}>
      {count} task{count === 1 ? '' : 's'} found
    </Typography>
  )
}
