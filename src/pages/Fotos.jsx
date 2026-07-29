import { useState, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLanguage } from '../i18n/LanguageContext'
import { SEEDED_PHOTOS } from '../data/photos'

const BASE = import.meta.env.BASE_URL

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
  const { t } = useLanguage()
  const T = t.fotos
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
    const tags = form.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
    setFotos(prev => [{ id: Date.now(), src: preview, fecha: form.fecha, titulo: form.titulo, tags }, ...prev])
    setPreview(null)
    setForm(f => ({ ...f, titulo: '', tags: '' }))
  }

  function del(id) {
    setFotos(prev => prev.filter(f => f.id !== id))
    setLightbox(null)
  }

  // merge seeded (static) + user-uploaded photos, newest first
  const seeded = SEEDED_PHOTOS.map(p => ({ ...p, src: `${BASE}photos/${p.file}`, seeded: true }))
  const allFotos = [...fotos, ...seeded].sort((a, b) => b.fecha.localeCompare(a.fecha))

  const allTags = [...new Set(allFotos.flatMap(f => f.tags))].sort()

  const visible = tagFilter
    ? allFotos.filter(f => f.tags.includes(tagFilter))
    : allFotos

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{T.title}</h1>
        <p className="page-sub">{T.sub(allFotos.length, seeded.length, fotos.length)}</p>
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
              {T.select}
              Seleccionar foto
            </button>
          )
        }
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

        <div className="form-row">
          <div className="field" style={{ flexBasis: 140 }}>
            <label>{T.dateLabel}</label>
            <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label>{T.titleLabel}</label>
            <input type="text" placeholder={T.titlePlaceholder} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="field" style={{ flex: 1 }}>
            <label>{T.tagsLabel}</label>
            <input type="text" placeholder={T.tagsPlaceholder} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" disabled={!preview}>{T.save}</button>
        </div>
      </form>

      {allTags.length > 0 && (
        <div className="stats-row" style={{ gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          <button
            className={`btn-ghost${tagFilter === '' ? ' active' : ''}`}
            style={tagFilter === '' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            onClick={() => setTagFilter('')}
          >{T.all}</button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`btn-ghost${tagFilter === tag ? ' active' : ''}`}
              style={tagFilter === tag ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
              onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
            >{tag}</button>
          ))}
        </div>
      )}

      {visible.length === 0
        ? <div className="empty">{fotos.length === 0 ? T.emptyNone : T.emptyTag}</div>
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
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{foto.fecha}{foto.seeded && ` · ${T.repo}`}</div>
                  {foto.tags.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {foto.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 9, padding: '1px 6px', background: 'var(--badge-d-bg)', color: 'var(--badge-d-fg)', borderRadius: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tag}</span>
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
                {!lightbox.seeded && <button className="btn-ghost" onClick={() => del(lightbox.id)}>{T.delete}</button>}
                <button className="btn-ghost" onClick={() => setLightbox(null)}>{T.close}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
