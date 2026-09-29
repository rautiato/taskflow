import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

const SIZES = {
  sm: { box: 30, font: 14 },
  md: { box: 34, font: 15 },
} as const

const styles = {
  root: {
    borderRadius: '8px',
    bgcolor: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'common.white',
    fontWeight: 700,
  },
  inverted: {
    bgcolor: 'common.white',
    color: 'primary.main',
  },
} satisfies Record<string, SxProps<Theme>>

export function Logo({
  variant = 'solid',
  size = 'md',
}: {
  variant?: 'solid' | 'inverted'
  size?: 'sm' | 'md'
}) {
  const inverted = variant === 'inverted'
  const { box, font } = SIZES[size]

  return (
    <Box
      data-testid="logo"
      sx={[
        styles.root,
        inverted && styles.inverted,
        { width: box, height: box, fontSize: font },
      ]}
    >
      TF
    </Box>
  )
}
