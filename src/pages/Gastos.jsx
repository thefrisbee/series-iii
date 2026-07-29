import { useState } from 'react'
import { useSyncedData } from '../sync/useSyncedData'

const CATS = ['Motor', 'Frenos', 'Dirección', 'Suspensión', 'Hidráulica', 'Carrocería', 'Herramientas', 'Otros']

const today = () => new Date().toISOString().slice(0, 10)

const fmt = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

export default function Gastos() {
  const [gastos, setGastos] = useSyncedData('gastos', [])
  const [form, setForm] = useState({ fecha: today(), concepto: '', monto: '', categoria: 'Otros', nota: '' })
  const [catFilter, setCatFilter] = useState('Todas')

  function submit(e) {
    e.preventDefault()
    if (!form.concepto.trim() || !form.monto) return
    setGastos(prev => [{ ...form, id: Date.now(), monto: parseFloat(form.monto) }, ...prev])
    setForm(f => ({ ...f, concepto: '', monto: '', nota: '' }))
  }

  function del(id) {
    setGastos(prev => prev.filter(g => g.id !== id))
  }

  const visible = catFilter === 'Todas' ? gastos : gastos.filter(g => g.categoria === catFilter)
  const total = visible.reduce((s, g) => s + g.monto, 0)
  const totalAll = gastos.reduce((s, g) => s + g.monto, 0)

  const field = (key, props) => (
    <div className="field">
      <label>{props.label}</label>
      {props.type === 'select'
        ? <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}>
            {props.options.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input
            type={props.type || 'text'}
            placeholder={props.placeholder}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          />
      }
    </div>
  )

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gastos</h1>
        <p className="page-sub">
          Total gastado: <strong className="mono">{fmt(totalAll)}</strong>
        </p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <div className="form-row">
          {field('fecha',     { label: 'Fecha', type: 'date' })}
          {field('categoria', { label: 'Categoría', type: 'select', options: CATS })}
        </div>
        <div className="form-row">
          {field('concepto', { label: 'Concepto', placeholder: 'Ej: Track Rod End RTC5867' })}
          {field('monto',    { label: 'Monto (ARS)', type: 'number', placeholder: '0' })}
          <button type="submit" className="btn-primary">Agregar</button>
        </div>
      </form>

      {/* Category filter */}
      <div className="stats-row" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 6 }}>
        {['Todas', ...CATS].map(c => (
          <button
            key={c}
            className={`btn-ghost${catFilter === c ? ' active' : ''}`}
            style={catFilter === c ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            onClick={() => setCatFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length > 0 && (
        <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--muted)' }}>
          {catFilter !== 'Todas' && <span>{catFilter}: <strong className="mono">{fmt(total)}</strong> · </span>}
          <span>{visible.length} {visible.length === 1 ? 'gasto' : 'gastos'}</span>
        </div>
      )}

      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">No hay gastos registrados.</div>
          : visible.map(g => (
            <div key={g.id} className="list-row" style={{ borderLeftColor: 'var(--stripe-done)' }}>
              <div className="row-main" style={{ gridTemplateColumns: '88px 1fr auto auto' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{g.fecha}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.concepto}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{g.categoria}{g.nota && ` · ${g.nota}`}</div>
                </div>
                <span className="mono" style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', paddingRight: 12 }}>{fmt(g.monto)}</span>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 11, padding: '3px 8px' }}
                  onClick={() => del(g.id)}
                >✕</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
