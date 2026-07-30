import { useLanguage } from '../i18n/LanguageContext'
import { AREAS, STATUS_META, DIAG_DATE } from '../data/diagnostico'

export default function Diagnostico() {
  const { lang, t } = useLanguage()
  const T = t.diagnostico
  const isEs = lang === 'es'

  const criticalCount = AREAS.filter(a => a.status === 'critico').length
  const toCheckCount  = AREAS.filter(a => a.status === 'por-evaluar').length

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">{T.title}</h1>
        <p className="page-sub">{T.sub(DIAG_DATE)}</p>
      </div>

      <div className="diag-summary">
        <div className="diag-summary-item">
          <span className="diag-summary-num s-critico">{criticalCount}</span>
          <span className="diag-summary-label">{T.critical}</span>
        </div>
        <div className="diag-summary-item">
          <span className="diag-summary-num s-evaluar">{toCheckCount}</span>
          <span className="diag-summary-label">{T.toInspect}</span>
        </div>
        <div className="diag-summary-item">
          <span className="diag-summary-num s-aceptable">
            {AREAS.filter(a => a.status === 'aceptable').length}
          </span>
          <span className="diag-summary-label">{T.acceptable}</span>
        </div>
        <div className="diag-summary-item">
          <span className="diag-summary-num s-inventariadas">
            {AREAS.filter(a => a.status === 'inventariadas').length}
          </span>
          <span className="diag-summary-label">{T.inventoried}</span>
        </div>
      </div>

      <div className="diag-grid">
        {AREAS.map(area => {
          const meta  = STATUS_META[area.status]
          const label = isEs ? area.es.label   : area.en.label
          const summ  = isEs ? area.es.summary : area.en.summary
          const items = isEs ? area.items.es   : area.items.en
          return (
            <div key={area.id} className={`diag-card diag-card-${area.status}`}>
              <div className="diag-card-header">
                <span className="diag-card-title">{label}</span>
                <span className={`diag-badge ${meta.cls}`}>
                  {isEs ? meta.es : meta.en}
                </span>
              </div>
              <p className="diag-card-summary">{summ}</p>
              <ul className="diag-list">
                {items.map((item, i) => (
                  <li key={i} className="diag-list-item">{item}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="diag-footer">{T.footer}</p>
    </>
  )
}
