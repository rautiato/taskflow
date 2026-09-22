import Box from '@mui/material/Box'
import type { ProjectPaletteColor } from '../models/project'

const SIZES = {
  sm: { box: 34, font: 13, radius: 1 },
  md: { box: 42, font: 14, radius: 1.25 },
} as const

export function ProjectBadge({
  initials,
  paletteColor,
  size = 'md',
}: {
  initials: string
  paletteColor: ProjectPaletteColor
  size?: 'sm' | 'md'
}) {
  const { box, font, radius } = SIZES[size]

  return (
    <Box
      sx={{
        width: box,
        height: box,
        borderRadius: radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: font,
        flexShrink: 0,
        bgcolor: `${paletteColor}.light`,
        color: `${paletteColor}.main`,
      }}
    >
      {initials}
    </Box>
  )
}
