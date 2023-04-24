import { useEffect, useState } from 'react'
import Dropzone from '@components/Dropzone'
import Nav from '@components/Nav'
import SharingModal from '@components/Sharing'
import { ipcRenderer } from 'electron'
import { History, LoaderState, Locale, ShareEvents } from '@shared'
import useLocalStorage from './hooks/useLocalStorage'
import HistoryTable from '@components/HistoryTable'
import Loader from '@components/Loader'
import SettingsModal from '@components/Settings'
import { useT } from 'talkr'

function App() {
  const [settings, toggleSettings] = useState(false)
  const [shared, setShared] = useState<string | null>(null)
  const {value: history, setValue: setHistory} = useLocalStorage<History>('history', [])
  const {T, locale} = useT()

  const updateSharedUrl = (_: any, url: string): void => {
    ipcRenderer.emit(LoaderState.StopLoading)
    // TODO error control
    setShared(url)
  }

  useEffect(() => {
    ipcRenderer.on(ShareEvents.SendShareUrl, updateSharedUrl)

    return () => {
      ipcRenderer.off(ShareEvents.SendShareUrl, updateSharedUrl)
    }
  }, [])

  const onUpload = (path: string) => {
    ipcRenderer.invoke(ShareEvents.ShareDirectory, path)
    setHistory((currHistory) => ([{
      path,
      sharedAt: Date.now()
    }, ...currHistory]));
  }

  const stopSharing = () => {
    setShared(null)
    ipcRenderer.invoke(ShareEvents.StopSharing)
  }

  return (
    <>
      <Loader/>

      <nav>
        <Nav toggleSettings={toggleSettings} T={T}/>
      </nav>
      <main className='space-y-6 pb-20'>
        <Dropzone onUpload={onUpload} />
        <HistoryTable history={history} locale={locale as Locale}/>
      </main>
      <SettingsModal T={T} show={settings} onClose={() => toggleSettings(false)}/>
      <SharingModal shared={shared} onStop={stopSharing} />
      
      {/*<Update/>*/}
    </>
    
  )
}

export default App
