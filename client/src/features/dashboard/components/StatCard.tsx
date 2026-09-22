import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

const styles = {
  root: {
    flex: 1,
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    p: 2.25,
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: 'text.secondary',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 30,
    fontWeight: 700,
  },
  note: {
    fontSize: 12,
    fontWeight: 600,
  },
} satisfies Record<string, SxProps<Theme>>

export function StatCard({
  label,
  value,
  note,
  noteColor,
}: {
  label: string
  value: number
  note: string
  noteColor: string
}) {
  return (
    <Box sx={styles.root}>
      <Typography sx={styles.label}>{label}</Typography>
      <Typography sx={styles.value}>{value}</Typography>
      <Typography sx={[styles.note, { color: noteColor }]}>{note}</Typography>
    </Box>
  )
}
