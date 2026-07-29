import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Necesito() {
  const [items, setItems]   = useLocalStorage('lr-necesito-v1', [])
  const [form, setForm]     = useState({ descripcion: '', referencia: '', prioridad: 'normal', nota: '' })
  const [filter, setFilter] = useState('todos')
  const [expanded, setExpanded] = useState(null)

  function add(e) {
    e.preventDefault()
    if (!form.descripcion.trim()) return
    setItems(prev => [{ ...form, id: Date.now(), status: 'necesito' }, ...prev])
    setForm({ descripcion: '', referencia: '', prioridad: 'normal', nota: '' })
  }

  function toggleStatus(id) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'necesito' ? 'conseguido' : 'necesito' } : i
    ))
  }

  function del(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const visible = filter === 'todos' ? items : items.filter(i => i.status === filter)
  const counts = {
    todos:     items.length,
    necesito:  items.filter(i => i.status === 'necesito').length,
    conseguido: items.filter(i => i.status === 'conseguido').length,
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Necesito conseguir</h1>
        <p className="page-sub">Partes o materiales por buscar</p>
      </div>

      <form className="form-card" onSubmit={add}>
        <div className="form-row">
          <div className="field" style={{ flex: 2 }}>
            <label>Descripción</label>
            <input
              type="text"
              placeholder="Ej: Junta de culata 2.25L"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
            />
          </div>
          <div className="field">
            <label>Código / referencia</label>
            <input
              type="text"
              placeholder="Ej: 538403"
              value={form.referencia}
              onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))}
            />
          </div>
          <div className="field" style={{ flexBasis: 120 }}>
            <label>Prioridad</label>
            <select value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>Nota (opcional)</label>
            <input
              type="text"
              placeholder="Dónde buscar, precio estimado, etc."
              value={form.nota}
              onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary">Agregar</button>
        </div>
      </form>

      <div className="stats-row">
        {[['todos','n','Todos'], ['necesito','p','Necesito'], ['conseguido','d','Conseguido']].map(([f, dot, label]) => (
          <button key={f} className={`stat-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            <span className={`stat-dot ${dot}`} />
            {label}
            <span className="stat-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">No hay items.</div>
          : visible.map(item => (
            <div key={item.id} className={`list-row s-${item.status}${expanded === item.id ? ' expanded' : ''}`}>
              <div
                className="row-main"
                style={{ gridTemplateColumns: '1fr auto auto' }}
                onClick={e => { if (!e.target.closest('button')) setExpanded(ex => ex === item.id ? null : item.id) }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.descripcion}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {item.referencia && <span className="mono">{item.referencia}</span>}
                    {item.referencia && item.prioridad !== 'normal' && ' · '}
                    {item.prioridad !== 'normal' && <span style={{ textTransform: 'capitalize' }}>{item.prioridad}</span>}
                    {item.nota && ` · ${item.nota}`}
                  </div>
                </div>
                <button className={`status-btn ${item.status}`} onClick={() => toggleStatus(item.id)}>
                  {item.status === 'necesito' ? 'Necesito' : 'Conseguido'}
                </button>
                <button className="btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => del(item.id)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
