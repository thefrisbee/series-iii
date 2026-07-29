import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || ''
const LS_CACHE   = 'lr-drive-v1'

const SyncContext = createContext(null)

export function SyncProvider({ children }) {
  const [data, _setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_CACHE) || '{}') } catch { return {} }
  })
  const [status, setStatus] = useState(SCRIPT_URL ? 'loading' : 'offline')
  const dataRef    = useRef(data)
  const saveTimer  = useRef(null)

  // keep ref in sync so the debounced save always sees latest data
  useEffect(() => { dataRef.current = data }, [data])

  // load from Drive on mount
  useEffect(() => {
    if (!SCRIPT_URL) return
    fetch(SCRIPT_URL)
      .then(r => r.text())
      .then(text => {
        const remote = JSON.parse(text || '{}')
        if (remote && typeof remote === 'object' && Object.keys(remote).length > 0) {
          _setData(remote)
          localStorage.setItem(LS_CACHE, JSON.stringify(remote))
        }
        setStatus('synced')
      })
      .catch(() => setStatus('error'))
  }, [])

  const setData = useCallback((key, value) => {
    _setData(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(LS_CACHE, JSON.stringify(next))
      dataRef.current = next

      if (SCRIPT_URL) {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        setStatus('dirty')
        saveTimer.current = setTimeout(() => {
          setStatus('syncing')
          fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(dataRef.current),
            headers: { 'Content-Type': 'text/plain' },
          })
            .then(() => setStatus('synced'))
            .catch(() => setStatus('error'))
        }, 900)
      }
      return next
    })
  }, [])

  return (
    <SyncContext.Provider value={{ data, setData, status }}>
      {children}
    </SyncContext.Provider>
  )
}

export function useSync() {
  return useContext(SyncContext)
}
