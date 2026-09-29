import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { SxProps, Theme } from '@mui/material/styles'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

const styles = {
  button: {
    p: 0.25,
    flexShrink: 0,
  },
  star: {
    color: 'warning.main',
  },
  starOutline: {
    color: '#C6CACF',
    '&:hover': { color: 'warning.main' },
  },
} satisfies Record<string, SxProps<Theme>>

// The task's star: one click pins it (shown first under any sort), another
// unpins it. Stops propagation so clicking it doesn't also open the task.
export function FavoriteToggle({
  isFavorite,
  onToggle,
  size = 16,
}: {
  isFavorite: boolean
  onToggle: () => void
  size?: number
}) {
  return (
    <Tooltip title={isFavorite ? 'Unpin' : 'Pin to top'}>
      <IconButton
        size="small"
        aria-label={isFavorite ? 'Unpin task' : 'Pin task to top'}
        aria-pressed={isFavorite}
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        sx={styles.button}
        data-testid="favorite-toggle"
      >
        {isFavorite ? (
          <StarIcon sx={[styles.star, { fontSize: size }]} />
        ) : (
          <StarBorderIcon sx={[styles.starOutline, { fontSize: size }]} />
        )}
      </IconButton>
    </Tooltip>
  )
}
