import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ProjectPaletteColor } from '../models/project'

const SIZES = {
  sm: { box: 34, font: 13, radius: 1 },
  md: { box: 42, font: 14, radius: 1.25 },
} as const

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0,
  },
} satisfies Record<string, SxProps<Theme>>

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
      data-testid="project-badge"
      sx={[
        styles.root,
        {
          width: box,
          height: box,
          borderRadius: radius,
          fontSize: font,
          bgcolor: `${paletteColor}.light`,
          color: `${paletteColor}.main`,
        },
      ]}
    >
      {initials}
    </Box>
  )
}
