import { writeJson } from './storage'

/**
 * Reads `key` from localStorage, seeding it on first run.
 * When `seedVersion` differs from the stored one, the stored data is
 * replaced with `seed` — bump the version only when old data must be reset.
 */
export function loadSeededData<T>(
  key: string,
  seedVersion: string,
  seed: T,
): T {
  const versionKey = `${key}.seedVersion`
  const raw = localStorage.getItem(key)
  const storedVersion = localStorage.getItem(versionKey)
  if (!raw || storedVersion !== seedVersion) {
    writeJson(key, seed)
    localStorage.setItem(versionKey, seedVersion)
    return seed
  }
  return JSON.parse(raw) as T
}
