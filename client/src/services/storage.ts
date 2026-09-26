// NO-BACKEND: this whole file exists because data lives in localStorage
// (about 5 MB per site). Remove it once a backend stores data server-side,
// and replace the writeJson calls in each service with API calls.

const KEY_PREFIX = 'taskflow.'

// Browsers don't expose localStorage's quota; about 5 million characters is
// the common limit in Chrome, Firefox and Safari.
export const STORAGE_LIMIT_CHARS = 5 * 1024 * 1024

export class StorageFullError extends Error {
  constructor() {
    super('Storage is full. Remove some attachments and try again.')
    this.name = 'StorageFullError'
  }
}

// Every write goes through here so a full quota surfaces as a readable error
// instead of a raw DOMException.
export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageFullError()
    }
    throw error
  }
}

export function getStorageUsedChars(): number {
  return Object.keys(localStorage)
    .filter((key) => key.startsWith(KEY_PREFIX))
    .reduce(
      (total, key) =>
        total + key.length + (localStorage.getItem(key)?.length ?? 0),
      0,
    )
}

export function getStorageFreeChars(): number {
  return Math.max(0, STORAGE_LIMIT_CHARS - getStorageUsedChars())
}

// Stored data is plain ASCII (JSON + base64), so one character ≈ one byte.
export function formatSize(chars: number): string {
  const kb = chars / 1024
  // Round tiny non-zero sizes up to 1 KB so they don't read as empty, but
  // keep a true zero as "0 KB".
  if (kb < 1024) return `${chars > 0 ? Math.max(1, Math.round(kb)) : 0} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
