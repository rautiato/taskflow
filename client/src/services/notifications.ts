// A tiny error-message store that code outside React (e.g. the QueryClient's
// global error handlers) can write to, and ErrorSnackbar reads from.
let message: string | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function notifyError(next: string) {
  message = next
  emit()
}

export function clearError() {
  message = null
  emit()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getErrorMessage() {
  return message
}
