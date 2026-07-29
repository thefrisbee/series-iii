import { useCallback } from 'react'
import { useSync } from './SyncContext'

// Drop-in replacement for useLocalStorage that syncs to Drive.
// key: string key in the Drive JSON object
// fallback: default value if no data in Drive or localStorage yet
export function useSyncedData(key, fallback) {
  const { data, setData } = useSync()
  const value = data[key] !== undefined ? data[key] : fallback

  const setValue = useCallback((val) => {
    setData(key, typeof val === 'function' ? val(data[key] !== undefined ? data[key] : fallback) : val)
  }, [key, setData, data, fallback])

  return [value, setValue]
}
