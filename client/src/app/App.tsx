import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { theme } from '../theme/theme'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ErrorSnackbar } from '../components/ErrorSnackbar'
import { AppRoutes } from './routes'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </BrowserRouter>
      <ErrorSnackbar />
    </ThemeProvider>
  )
}

export default App
