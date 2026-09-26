import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import App from './app/App.tsx'
import { notifyError } from './services/notifications'

function messageOf(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

// One place that reports every failed load or save, so no hook or page has
// to remember to.
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => notifyError(messageOf(error, 'Could not load data.')),
  }),
  mutationCache: new MutationCache({
    onError: (error) =>
      notifyError(messageOf(error, 'Could not save your changes.')),
  }),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
