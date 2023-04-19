import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Talkr } from "talkr"
import './samples/node-api'
import './index.css'
import en from "./i18n/en.json"
import es from "./i18n/es.json"
import de from "./i18n/de.json"
import { Locale, Settings } from '@shared'

let locale: Locale = 'en'
try {
  const saved = localStorage.getItem('settings')
  if (saved !== null) {
    const settings: Settings = JSON.parse(saved)
    locale = settings.locale
  }
} catch {
  locale = 'en'
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Talkr languages={{en, es, de}} defaultLanguage={locale || 'en'}>
      <App />
    </Talkr>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
