import { useState } from 'react'
import Dropzone from '@components/Dropzone'
import Nav from '@components/Nav'
import { History, Locale } from '@shared'
import { useLocalStorage, useConnection } from '@hooks'
import HistoryTable from '@components/HistoryTable'
import Loader from '@components/Loader'
import SettingsModal from '@components/Settings'
import { useT } from 'talkr'
import { Toaster } from 'sonner'
import ContextMenu from '@components/ContextMenu'
import { toggleScroll } from './utils/scroll'

function App() {
  const [settings, toggleSettings] = useState(false)
  const { value: history, setValue: setHistory } = useLocalStorage<History>('history', [])
  const isConnected = useConnection()
  const { T, locale } = useT()

  return (
    <>
      <Toaster richColors position="top-center"/>
      <Loader/>
      <ContextMenu/>

      <nav>
        <Nav toggleSettings={(state) => {
          toggleSettings(state)
          toggleScroll(!state)
        }} T={T} isConnected={isConnected} />
      </nav>
      <main className='space-y-6 pb-20'>
        <Dropzone setHistory={setHistory} T={T} isConnected={isConnected} />
        { history?.length ? <HistoryTable history={history} locale={locale as Locale} setHistory={setHistory} T={T}/> : <></> }
      </main>

      {/* Modals */}
      <SettingsModal setHistory={setHistory} show={settings} onClose={() => {
        toggleSettings(false)
        toggleScroll(true)
      }} />
      {/*<SharingModal shared={shared} onStop={stopSharing} />*/}
      
      {/*<Update/>*/}
    </>
    
  )
}

export default App
