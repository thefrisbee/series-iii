import { useState } from 'react'
import { useSyncedData } from '../sync/useSyncedData'
import { useLanguage } from '../i18n/LanguageContext'
import { REPUESTOS } from '../data/repuestos'

const STATUSES = ['pendiente', 'ordenado', 'instalado']

function copyPart(p) {
  const lines = [p.descripcion]
  if (p.codigo !== '—') lines.push(p.codigo)
  if (p.marca !== '—') lines.push(p.marca)
  lines.push('Land Rover Series III')
  if (p.cantidad > 1) lines.push(`Qty: ${p.cantidad}`)
  navigator.clipboard.writeText(lines.join('\n'))
}

const fmt = (n) =>
  n > 0
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
    : '—'

const INIT = REPUESTOS.map(p => ({ id: p.id, status: 'pendiente', nota: '', precio: p.precio || 0 }))

export default function Repuestos() {
  const { t } = useLanguage()
  const T = t.repuestos
  const [saved, setSaved]       = useSyncedData('repuestos', INIT)
  const [filter, setFilter]     = useState('todos')
  const [expanded, setExpanded] = useState(null)
  const [copied, setCopied]     = useState(null)

  const state = REPUESTOS.map(p => {
    const s = saved.find(x => x.id === p.id) || { status: 'pendiente', nota: '', precio: p.precio || 0 }
    return { ...p, status: s.status, nota: s.nota || '', precio: s.precio || p.precio || 0 }
  })

  const totalCost = state.reduce((sum, p) => sum + (p.precio || 0) * p.cantidad, 0)

  const counts = {
    todos:     state.length,
    pendiente: state.filter(p => p.status === 'pendiente').length,
    ordenado:  state.filter(p => p.status === 'ordenado').length,
    instalado: state.filter(p => p.status === 'instalado').length,
  }

  const visible = filter === 'todos' ? state : state.filter(p => p.status === filter)
  const pct = state.length ? (counts.instalado / state.length * 100) : 0

  function cycleStatus(id) {
    setSaved(prev => prev.map(p =>
      p.id === id ? { ...p, status: STATUSES[(STATUSES.indexOf(p.status) + 1) % STATUSES.length] } : p
    ))
  }

  function update(id, fields) {
    setSaved(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
  }

  function handleCopy(e, p) {
    e.stopPropagation()
    copyPart(p)
    setCopied(p.id)
    setTimeout(() => setCopied(c => c === p.id ? null : c), 1500)
  }

  const statusLabel = { pendiente: T.pending, ordenado: T.ordered, instalado: T.installed }

  return (
    <>
      {/* ── HEADER ── */}
      <div className="page-header">
        <div className="rep-header-grid">
          <div>
            <h1 className="page-title">{T.title}</h1>
            <p className="page-sub">{T.sub}</p>
          </div>
          {totalCost > 0 && (
            <div className="cost-hero">
              <div className="cost-hero-label">{t.gastos.totalSpent}</div>
              <div className="cost-hero-amount">{fmt(totalCost)}</div>
            </div>
          )}
        </div>
        <div className="page-hero-img">
          <img src={`${import.meta.env.BASE_URL}photos/img_2374.jpg`} alt="Land Rover Series III" />
        </div>
        <div className="progress-row" style={{ marginTop: 14 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">{T.progress(counts.instalado, state.length)}</span>
        </div>
      </div>

      {/* ── STATUS PILLS ── */}
      <div className="status-pills-row">
        {[['todos','n', T.all], ['pendiente','p', T.pending], ['ordenado','o', T.ordered], ['instalado','d', T.installed]].map(([f, dot, label]) => (
          <button key={f} className={`stat-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            <span className={`stat-dot ${dot}`} />
            {label}
            <span className="stat-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* ── LIST ── */}
      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">{T.empty}</div>
          : visible.map(p => {
            const lineTotal = (p.precio || 0) * p.cantidad
            return (
              <div key={p.id} className={`list-row s-${p.status}${expanded === p.id ? ' expanded' : ''}`}>
                <div
                  className="row-main rep-row-grid"
                  onClick={e => { if (!e.target.closest('button') && !e.target.closest('input')) setExpanded(ex => ex === p.id ? null : p.id) }}
                >
                  <span className="mono part-code">{p.codigo}</span>
                  <div className="part-info">
                    <div className="part-desc">{p.descripcion}</div>
                    {p.marca !== '—' && <div className="part-brand">{p.marca}</div>}
                  </div>
                  <span className="mono part-qty">×{p.cantidad}</span>
                  <span className="mono part-price" style={{ color: lineTotal > 0 ? 'var(--text)' : 'var(--muted)', fontSize: 11 }}>
                    {lineTotal > 0 ? fmt(lineTotal) : '—'}
                  </span>
                  <button title="Copy for search" onClick={e => handleCopy(e, p)} className="copy-btn">
                    {copied === p.id ? '✓' : '⎘'}
                  </button>
                  <button className={`status-btn ${p.status}`} onClick={() => cycleStatus(p.id)}>
                    {statusLabel[p.status]}
                  </button>
                </div>
                <div className="row-expand rep-expand">
                  <div className="rep-expand-inner">
                    <div className="field" style={{ flex: '0 0 120px' }}>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                        Unit price (£)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={p.precio || ''}
                        onChange={e => update(p.id, { precio: parseFloat(e.target.value) || 0 })}
                        onClick={e => e.stopPropagation()}
                        style={{ padding: '6px 10px', width: '100%', fontVariantNumeric: 'tabular-nums' }}
                      />
                    </div>
                    <div className="field" style={{ flex: '0 0 80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                        Qty
                      </div>
                      <div style={{ padding: '6px 10px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 6, fontVariantNumeric: 'tabular-nums', color: 'var(--muted)', fontSize: 13 }}>
                        ×{p.cantidad}
                      </div>
                    </div>
                    <div className="field" style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
                        Total
                      </div>
                      <div style={{ padding: '6px 10px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 6, fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: 13 }}>
                        {lineTotal > 0 ? fmt(lineTotal) : '—'}
                      </div>
                    </div>
                    <div className="field" style={{ flex: 1 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
                        {t.repuestos.notePlaceholder}
                      </label>
                      <textarea
                        className="note-input"
                        rows={1}
                        placeholder={T.notePlaceholder}
                        value={p.nota}
                        onChange={e => update(p.id, { nota: e.target.value })}
                        onClick={e => e.stopPropagation()}
                        style={{ minHeight: 36, resize: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}
