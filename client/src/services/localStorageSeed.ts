export function loadSeededData<T>(
  key: string,
  seedVersion: string,
  seed: T,
): T {
  const versionKey = `${key}.seedVersion`
  const raw = localStorage.getItem(key)
  const storedVersion = localStorage.getItem(versionKey)
  if (!raw || storedVersion !== seedVersion) {
    localStorage.setItem(key, JSON.stringify(seed))
    localStorage.setItem(versionKey, seedVersion)
    return seed
  }
  return JSON.parse(raw) as T
}
