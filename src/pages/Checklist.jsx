import { useState } from 'react'
import { useSyncedData } from '../sync/useSyncedData'
import { useLanguage } from '../i18n/LanguageContext'

const SEED = [
  'Limpiar y desgrasar el chasis',
  'Inspeccionar y tratar óxido del chasis',
  'Desmontar ejes delantero y trasero',
  'Cambiar todos los oil seals',
  'Instalar shackle bushes y chassis bushes',
  'Revisar y reconstruir frenos',
  'Cambiar cilindros de rueda',
  'Cambiar mangueras de freno',
  'Verificar y cambiar hoses de radiador',
  'Instalar amortiguadores nuevos',
  'Cambiar track rod ends y tie rod end',
  'Instalar amortiguador de dirección',
  'Reconstruir sistema hidráulico embrague',
  'Verificar caja de transferencia',
  'Inspeccionar motor',
  'Revisar sistema eléctrico',
  'Pintura de chasis',
  'Pintura exterior carrocería',
  'Armado final',
  'Prueba de ruta',
]

export default function Checklist() {
  const { t } = useLanguage()
  const T = t.checklist
  const [items, setItems] = useSyncedData('checklist',
    SEED.map((text, i) => ({ id: i, text, checked: false }))
  )
  const [newText, setNewText] = useState('')

  const done  = items.filter(i => i.checked).length
  const total = items.length
  const pct   = total ? (done / total * 100) : 0

  function toggle(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function add(e) {
    e.preventDefault()
    if (!newText.trim()) return
    setItems(prev => [...prev, { id: Date.now(), text: newText.trim(), checked: false }])
    setNewText('')
  }

  function del(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const pending   = items.filter(i => !i.checked)
  const completed = items.filter(i => i.checked)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{T.title}</h1>
        <p className="page-sub">{T.sub}</p>
        <div className="page-hero-img">
          <img src={`${import.meta.env.BASE_URL}photos/img_4577.jpg`} alt="Land Rover Series III" />
        </div>
        <div className="progress-row" style={{ marginTop: 14 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-label">{T.done(done, total)}</span>
        </div>
      </div>


      <form className="form-card" onSubmit={add} style={{ padding: '12px 16px' }}>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>{T.newTask}</label>
            <input type="text" placeholder={T.placeholder} value={newText} onChange={e => setNewText(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">{T.add}</button>
        </div>
      </form>

      {pending.length > 0 && (
        <div className="list-box" style={{ marginBottom: 16 }}>
          {pending.map(item => (
            <CheckItem key={item.id} item={item} onToggle={toggle} onDel={del} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div style={{ marginTop: 8 }}><>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            {T.completedSection(completed.length)}
          </div>
          <div className="list-box">
            {completed.map(item => (
              <CheckItem key={item.id} item={item} onToggle={toggle} onDel={del} />
            ))}
          </div>
        </></div>
      )}

      {items.length === 0 && <div className="empty">{T.empty}</div>}
    </>
  )
}

function CheckItem({ item, onToggle, onDel }) {
  return (
    <div className={`list-row s-${item.checked ? 'checked' : 'pendiente'}`}>
      <div className="row-main" style={{ gridTemplateColumns: '28px 1fr 32px' }}>
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent)' }}
        />
        <span style={{
          fontSize: 13,
          fontWeight: 500,
          textDecoration: item.checked ? 'line-through' : 'none',
          color: item.checked ? 'var(--muted)' : 'var(--text)',
        }}>
          {item.text}
        </span>
        <button
          className="btn-ghost"
          style={{ fontSize: 11, padding: '3px 7px' }}
          onClick={() => onDel(item.id)}
        >✕</button>
      </div>
    </div>
  )
}
