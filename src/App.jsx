import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useSync } from './sync/SyncContext'
import { useLanguage } from './i18n/LanguageContext'
import Repuestos from './pages/Repuestos'
import Gastos from './pages/Gastos'
import Checklist from './pages/Checklist'
import Necesito from './pages/Necesito'
import Fotos from './pages/Fotos'
import './App.css'

const NAV_ICONS = { repuestos: '⚙', gastos: '$', checklist: '✓', necesito: '↗', fotos: '◉' }
const NAV_KEYS  = ['repuestos', 'gastos', 'checklist', 'necesito', 'fotos']

function SyncBadge() {
  const { status } = useSync()
  const { t } = useLanguage()
  const dot = {
    loading: 'sync-dot loading', syncing: 'sync-dot loading',
    synced:  'sync-dot synced',  dirty:   'sync-dot dirty',
    error:   'sync-dot error',   offline: 'sync-dot offline',
  }[status] || 'sync-dot offline'
  const label = t.sync[status] || t.sync.offline
  return (
    <div className="sync-badge" title={status}>
      <span className={dot} />
      <span className="sync-label">{label}</span>
    </div>
  )
}

function LangToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <button
      className="lang-toggle"
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      title="Switch language / Cambiar idioma"
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )
}

export default function App() {
  const { t } = useLanguage()
  return (
    <div className="layout">
      <header className="top-bar">
        <div className="top-bar-inner">
          <div className="wordmark">
            <span className="wordmark-title">Land Rover Series III</span>
            <span className="wordmark-sub">{t.wordmark.sub}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <nav className="nav">
              {NAV_KEYS.map(key => (
                <NavLink key={key} to={`/${key}`} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  <span className="nav-icon">{NAV_ICONS[key]}</span>
                  <span className="nav-label">{t.nav[key]}</span>
                </NavLink>
              ))}
            </nav>
            <LangToggle />
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
