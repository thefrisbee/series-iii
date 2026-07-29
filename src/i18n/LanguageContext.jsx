import { createContext, useContext, useState } from 'react'
import en from './en'
import es from './es'

const LANGS = { en, es }
const LS_KEY = 'lr-lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(LS_KEY)
    return saved === 'en' ? 'en' : 'es'
  })

  function setLang(l) {
    setLangState(l)
    localStorage.setItem(LS_KEY, l)
  }

  const t = LANGS[lang]

  return (
    <LanguageContext.Provider value={{ t, lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
