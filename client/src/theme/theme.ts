import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
      dark: '#115293',
    },
    error: {
      main: '#D32F2F',
      light: '#FDECEA',
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
  },
})
