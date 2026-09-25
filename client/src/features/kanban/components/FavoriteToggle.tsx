import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

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
        sx={{ p: 0.25, flexShrink: 0 }}
      >
        {isFavorite ? (
          <StarIcon sx={{ fontSize: size, color: 'warning.main' }} />
        ) : (
          <StarBorderIcon
            sx={{
              fontSize: size,
              color: '#C6CACF',
              '&:hover': { color: 'warning.main' },
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  )
}
