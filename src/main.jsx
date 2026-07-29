import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { SyncProvider } from './sync/SyncContext'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <SyncProvider>
          <App />
        </SyncProvider>
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
