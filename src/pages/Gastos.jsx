import { useState } from 'react'
import { useSyncedData } from '../sync/useSyncedData'
import { useLanguage } from '../i18n/LanguageContext'

// Internal category keys — language-independent storage
const CAT_KEYS = ['engine', 'brakes', 'steering', 'suspension', 'hydraulics', 'body', 'tools', 'other']

const today = () => new Date().toISOString().slice(0, 10)

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function Gastos() {
  const { t } = useLanguage()
  const T = t.gastos
  const [gastos, setGastos] = useSyncedData('gastos', [])
  const [form, setForm] = useState({ fecha: today(), concepto: '', monto: '', categoria: 'other', nota: '' })
  const [catFilter, setCatFilter] = useState('all')

  function submit(e) {
    e.preventDefault()
    if (!form.concepto.trim() || !form.monto) return
    setGastos(prev => [{ ...form, id: Date.now(), monto: parseFloat(form.monto) }, ...prev])
    setForm(f => ({ ...f, concepto: '', monto: '', nota: '' }))
  }

  function del(id) {
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  const visible = catFilter === 'all' ? gastos : gastos.filter(g => g.categoria === catFilter)
  const total    = visible.reduce((s, g) => s + g.monto, 0)
  const totalAll = gastos.reduce((s, g) => s + g.monto, 0)

  return (
    <>
      <div className="page-header">
        <div className="rep-header-grid">
          <div>
            <h1 className="page-title">{T.title}</h1>
            <p className="page-sub">{T.totalSpent}: <strong className="mono">{fmt(totalAll)}</strong></p>
          </div>
          {totalAll > 0 && (
            <div className="cost-hero">
              <div className="cost-hero-label">{T.totalSpent}</div>
              <div className="cost-hero-amount">{fmt(totalAll)}</div>
            </div>
          )}
        </div>
      </div>

      <form className="form-card" onSubmit={submit}>
        <div className="form-row">
          <div className="field">
            <label>{T.date}</label>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="field">
            <label>{T.category}</label>
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {CAT_KEYS.map(k => <option key={k} value={k}>{T.cats[k]}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field" style={{ flex: 2 }}>
            <label>{T.description}</label>
            <input type="text" placeholder="Ej: Track Rod End RTC5867" value={form.concepto} onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))} />
          </div>
          <div className="field" style={{ flexBasis: 120 }}>
            <label>{T.amount}</label>
            <input type="number" min="0" step="0.01" placeholder="0" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary">{T.add}</button>
        </div>
      </form>

      <div className="stats-row" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
        {[['all', T.allCats], ...CAT_KEYS.map(k => [k, T.cats[k]])].map(([k, label]) => (
          <button
            key={k}
            className="btn-ghost"
            style={catFilter === k ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            onClick={() => setCatFilter(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length > 0 && (
        <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--muted)' }}>
          {catFilter !== 'all' && <span>{T.cats[catFilter]}: <strong className="mono">{fmt(total)}</strong> · </span>}
          <span>{T.expenses(visible.length)}</span>
        </div>
      )}

      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">{T.empty}</div>
          : visible.map(g => (
            <div key={g.id} className="list-row" style={{ borderLeftColor: 'var(--stripe-done)' }}>
              <div className="row-main" style={{ gridTemplateColumns: '88px 1fr auto auto' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{g.fecha}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.concepto}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {T.cats[g.categoria] || g.categoria}{g.nota && ` · ${g.nota}`}
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', paddingRight: 12 }}>{fmt(g.monto)}</span>
                <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => del(g.id)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
