import { useState, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MAX_DIM = 1400
const QUALITY = 0.82

function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', QUALITY))
    }
    img.src = url
  })
}

const today = () => new Date().toISOString().slice(0, 10)

export default function Fotos() {
  const [fotos, setFotos] = useLocalStorage('lr-fotos-v1', [])
  const [form, setForm]   = useState({ fecha: today(), titulo: '', tags: '' })
  const [preview, setPreview] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [tagFilter, setTagFilter] = useState('')
  const fileRef = useRef()

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const data64 = await compressImage(file)
    setPreview(data64)
    e.target.value = ''
  }

  function submit(e) {
    e.preventDefault()
    if (!preview) return
    const tags = form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    setFotos(prev => [{ id: Date.now(), src: preview, fecha: form.fecha, titulo: form.titulo, tags }, ...prev])
    setPreview(null)
    setForm(f => ({ ...f, titulo: '', tags: '' }))
  }

  function del(id) {
    setFotos(prev => prev.filter(f => f.id !== id))
    setLightbox(null)
  }

  const allTags = [...new Set(fotos.flatMap(f => f.tags))].sort()

  const visible = tagFilter
    ? fotos.filter(f => f.tags.includes(tagFilter))
    : fotos

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Fotos del avance</h1>
        <p className="page-sub">{fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'} · guardadas en este dispositivo</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        {preview
          ? <img src={preview} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 1, marginBottom: 12 }} />
          : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              style={{
                width: '100%', padding: '28px 0', marginBottom: 12,
                background: 'var(--bg)', border: '1px dashed var(--border)',
                borderRadius: 2, color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
              }}
            >
              Seleccionar foto
            </button>
          )
        }
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

        <div className="form-row">
          <div className="field" style={{ flexBasis: 140 }}>
            <label>Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label>Título</label>
            <input type="text" placeholder="Ej: Desmontaje de eje trasero" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>Tags (separados por coma)</label>
            <input type="text" placeholder="Ej: ejes, frenos, motor" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" disabled={!preview}>Guardar foto</button>
        </div>
      </form>

      {allTags.length > 0 && (
        <div className="stats-row" style={{ gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          <button
            className={`btn-ghost${tagFilter === '' ? ' active' : ''}`}
            style={tagFilter === '' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            onClick={() => setTagFilter('')}
          >Todas</button>
          {allTags.map(t => (
            <button
              key={t}
              className={`btn-ghost${tagFilter === t ? ' active' : ''}`}
              style={tagFilter === t ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
              onClick={() => setTagFilter(t === tagFilter ? '' : t)}
            >{t}</button>
          ))}
        </div>
      )}

      {visible.length === 0
        ? <div className="empty">{fotos.length === 0 ? 'Todavía no hay fotos.' : 'No hay fotos con ese tag.'}</div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {visible.map(foto => (
              <div
                key={foto.id}
                style={{ cursor: 'pointer', borderRadius: 2, overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)' }}
                onClick={() => setLightbox(foto)}
              >
                <img
                  src={foto.src}
                  alt={foto.titulo}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '7px 10px' }}>
                  {foto.titulo && <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{foto.titulo}</div>}
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{foto.fecha}</div>
                  {foto.tags.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {foto.tags.map(t => (
                        <span key={t} style={{ fontSize: 9, padding: '1px 6px', background: 'var(--badge-d-bg)', color: 'var(--badge-d-fg)', borderRadius: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }

      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
          onClick={() => setLightbox(null)}
        >
          <div style={{ maxWidth: 900, width: '100%' }} onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.titulo} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', borderRadius: 1 }} />
            <div style={{ background: 'var(--surface)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {lightbox.titulo && <div style={{ fontWeight: 600, marginBottom: 2 }}>{lightbox.titulo}</div>}
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{lightbox.fecha}{lightbox.tags.length > 0 && ` · ${lightbox.tags.join(', ')}`}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-ghost" onClick={() => del(lightbox.id)}>Eliminar</button>
                <button className="btn-ghost" onClick={() => setLightbox(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
