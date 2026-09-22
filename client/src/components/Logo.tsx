import Box from '@mui/material/Box'

const SIZES = {
  sm: { box: 30, font: 14 },
  md: { box: 34, font: 15 },
} as const

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
      sx={{
        width: box,
        height: box,
        borderRadius: '8px',
        bgcolor: inverted ? '#fff' : 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: inverted ? 'primary.main' : '#fff',
        fontWeight: 700,
        fontSize: font,
      }}
    >
      TF
    </Box>
  )
}
