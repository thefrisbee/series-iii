import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useSync } from './sync/SyncContext'
import Repuestos from './pages/Repuestos'
import Gastos from './pages/Gastos'
import Checklist from './pages/Checklist'
import Necesito from './pages/Necesito'
import Fotos from './pages/Fotos'
import './App.css'

const SYNC_UI = {
  loading: { dot: 'sync-dot loading', label: 'cargando' },
  syncing: { dot: 'sync-dot loading', label: 'guardando' },
  synced:  { dot: 'sync-dot synced',  label: 'sincronizado' },
  dirty:   { dot: 'sync-dot dirty',   label: 'por guardar' },
  error:   { dot: 'sync-dot error',   label: 'error' },
  offline: { dot: 'sync-dot offline', label: 'local' },
}

function SyncBadge() {
  const { status } = useSync()
  const ui = SYNC_UI[status] || SYNC_UI.offline
  return (
    <div className="sync-badge" title={status}>
      <span className={ui.dot} />
      <span className="sync-label">{ui.label}</span>
    </div>
  )
}

const NAV = [
  { to: '/repuestos', label: 'Repuestos', icon: '⚙' },
  { to: '/gastos',    label: 'Gastos',    icon: '$' },
  { to: '/checklist', label: 'Checklist', icon: '✓' },
  { to: '/necesito',  label: 'Necesito',  icon: '↗' },
  { to: '/fotos',     label: 'Fotos',     icon: '◉' },
]

export default function App() {
  return (
    <div className="layout">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="wordmark">
            <span className="wordmark-title">Land Rover Series III</span>
            <span className="wordmark-sub">Restauración · pickup · cabina simple</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <nav className="nav">
              {NAV.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <span className="nav-icon">{icon}</span>
                  <span className="nav-label">{label}</span>
                </NavLink>
              ))}
            </nav>
            <SyncBadge />
          </div>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/repuestos" replace />} />
          <Route path="/repuestos" element={<Repuestos />} />
          <Route path="/gastos"    element={<Gastos />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/necesito"  element={<Necesito />} />
          <Route path="/fotos"     element={<Fotos />} />
        </Routes>
      </main>
    </div>
  )
}
