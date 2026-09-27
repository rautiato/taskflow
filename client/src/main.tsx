import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { App } from './app/App'
import { notifyError } from './services/notifications'
import { errorMessage } from './utils/errorMessage'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) =>
      notifyError(errorMessage(error, 'Could not load data.')),
  }),
  mutationCache: new MutationCache({
    onError: (error) =>
      notifyError(errorMessage(error, 'Could not save your changes.')),
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
