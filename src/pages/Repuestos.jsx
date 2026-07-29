import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { REPUESTOS } from '../data/repuestos'

const STATUSES = ['pendiente', 'ordenado', 'instalado']
const LABELS   = { pendiente: 'Pendiente', ordenado: 'Ordenado', instalado: 'Instalado' }

function copyPart(p) {
  const lines = [p.descripcion]
  if (p.codigo !== '—') lines.push(`Código: ${p.codigo}`)
  if (p.marca !== '—') lines.push(`Marca: ${p.marca}`)
  if (p.cantidad > 1) lines.push(`Cantidad: ${p.cantidad}`)
  navigator.clipboard.writeText(lines.join('\n'))
}

const INIT = REPUESTOS.map(p => ({ id: p.id, status: 'pendiente', nota: '' }))

export default function Repuestos() {
  const [saved, setSaved] = useLocalStorage('lr-repuestos-v1', INIT)
  const [filter, setFilter]   = useState('todos')
  const [expanded, setExpanded] = useState(null)
  const [copied, setCopied]   = useState(null)

  const state = REPUESTOS.map(p => {
    const s = saved.find(x => x.id === p.id) || { status: 'pendiente', nota: '' }
    return { ...p, status: s.status, nota: s.nota }
  })

  const counts = {
    todos: state.length,
    pendiente:  state.filter(p => p.status === 'pendiente').length,
    ordenado:   state.filter(p => p.status === 'ordenado').length,
    instalado:  state.filter(p => p.status === 'instalado').length,
  }

  const visible = filter === 'todos' ? state : state.filter(p => p.status === filter)
  const pct = state.length ? (counts.instalado / state.length * 100) : 0

  function cycleStatus(id) {
    setSaved(prev => prev.map(p =>
      p.id === id ? { ...p, status: STATUSES[(STATUSES.indexOf(p.status) + 1) % STATUSES.length] } : p
    ))
  }

  function setNota(id, nota) {
    setSaved(prev => prev.map(p => p.id === id ? { ...p, nota } : p))
  }

  function toggleExpand(id) {
    setExpanded(e => e === id ? null : id)
  }

  function handleCopy(e, p) {
    e.stopPropagation()
    copyPart(p)
    setCopied(p.id)
    setTimeout(() => setCopied(c => c === p.id ? null : c), 1500)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Repuestos</h1>
        <p className="page-sub">Inventario actual · tocá el estado para avanzar</p>
        <div className="progress-row">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">{counts.instalado} / {state.length} instalados</span>
        </div>
      </div>

      <div className="stats-row">
        {[['todos','n','Todos'], ['pendiente','p','Pendiente'], ['ordenado','o','Ordenado'], ['instalado','d','Instalado']].map(([f, dot, label]) => (
          <button key={f} className={`stat-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            <span className={`stat-dot ${dot}`} />
            {label}
            <span className="stat-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">No hay repuestos en esta categoría.</div>
          : visible.map(p => (
            <div key={p.id} className={`list-row s-${p.status}${expanded === p.id ? ' expanded' : ''}`}>
              <div
                className="row-main"
                style={{ gridTemplateColumns: '108px 1fr 32px 30px 88px' }}
                onClick={e => { if (!e.target.closest('button')) toggleExpand(p.id) }}
              >
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.codigo}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{p.descripcion}</div>
                  {p.marca !== '—' && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.marca}</div>}
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>×{p.cantidad}</span>
                <button
                  title="Copiar info"
                  onClick={e => handleCopy(e, p)}
                  style={{
                    background: 'none', border: 'none', padding: '4px 2px',
                    fontSize: 13, color: copied === p.id ? 'var(--stripe-done)' : 'var(--muted)',
                    cursor: 'pointer', transition: 'color 0.15s',
                  }}
                >
                  {copied === p.id ? '✓' : '⎘'}
                </button>
                <button className={`status-btn ${p.status}`} onClick={() => cycleStatus(p.id)}>
                  {LABELS[p.status]}
                </button>
              </div>
              <div className="row-expand">
                <textarea
                  className="note-input"
                  rows={2}
                  placeholder="Nota…"
                  value={p.nota}
                  onChange={e => setNota(p.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
