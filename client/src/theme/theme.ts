import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      dark: '#115293',
      light: '#E8F0FE',
    },
    error: {
      main: '#D32F2F',
      light: '#FDECEA',
    },
    success: {
      main: '#1E7E34',
      light: '#E6F4EA',
    },
    warning: {
      main: '#ED6C02',
      light: '#FFF4E5',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1F23',
      secondary: '#5F6368',
    },
    divider: '#E0E3E8',
  },

  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        slotProps: {
          inputLabel: { shrink: true },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === 'standard' &&
            ownerState.severity === 'error' && {
              color: '#D32F2F',
              backgroundColor: '#FDECEA',
            }),
        }),
      },
    },
  },
})
