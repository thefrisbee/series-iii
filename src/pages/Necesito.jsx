import { useState } from 'react'
import { useSyncedData } from '../sync/useSyncedData'
import { useLanguage } from '../i18n/LanguageContext'

export default function Necesito() {
  const { t } = useLanguage()
  const T = t.necesito
  const [items, setItems]   = useSyncedData('necesito', [])
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
        <h1 className="page-title">{T.title}</h1>
        <p className="page-sub">{T.sub}</p>
        <div className="page-hero-img">
          <img src={`${import.meta.env.BASE_URL}photos/img_4569.jpg`} alt="Land Rover Series III" />
        </div>
      </div>

      <form className="form-card" onSubmit={add}>
        <div className="form-row">
          <div className="field" style={{ flex: 2 }}>
            <label>{T.descLabel}</label>
            <input type="text" placeholder={T.descPlaceholder} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="field">
            <label>{T.refLabel}</label>
            <input type="text" placeholder={T.refPlaceholder} value={form.referencia} onChange={e => setForm(f => ({ ...f, referencia: e.target.value }))} />
          </div>
          <div className="field" style={{ flexBasis: 120 }}>
            <label>{T.prioLabel}</label>
            <select value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value }))}>
              {['alta', 'normal', 'baja'].map(p => <option key={p} value={p}>{T.prios[p]}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>{T.noteLabel}</label>
            <input type="text" placeholder={T.notePlaceholder} value={form.nota} onChange={e => setForm(f => ({ ...f, nota: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary">{T.add}</button>
        </div>
      </form>

      <div className="stats-row">
        {[['todos','n', T.all], ['necesito','p', T.needed], ['conseguido','d', T.found]].map(([f, dot, label]) => (
          <button key={f} className={`stat-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            <span className={`stat-dot ${dot}`} />
            {label}
            <span className="stat-count">{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="list-box">
        {visible.length === 0
          ? <div className="empty">{T.empty}</div>
          : visible.map(item => (
            <div key={item.id} className={`list-row s-${item.status}`}>
              <div className="row-main" style={{ gridTemplateColumns: '1fr auto auto' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.descripcion}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {item.referencia && <span className="mono">{item.referencia}</span>}
                    {item.referencia && item.prioridad !== 'normal' && ' · '}
                    {item.prioridad !== 'normal' && <span>{T.prios[item.prioridad]}</span>}
                    {item.nota && ` · ${item.nota}`}
                  </div>
                </div>
                <button className={`status-btn ${item.status}`} onClick={() => toggleStatus(item.id)}>
                  {item.status === 'necesito' ? T.need : T.found}
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
