import { useEffect, useState } from 'react'
import Dropzone from '@components/Dropzone'
import Nav from '@components/Nav'
import SharingModal from '@components/Sharing'
import { ipcRenderer } from 'electron'
import { ShareEvents } from '@shared'
import SettingsModal from '@components/Settings'

function App() {
  const [shared, setShared] = useState<string | null>(null)
  const [settingsVisible, setSettingsVisibility] = useState(false)

  const updateSharedUrl = (_: any, url: string) => {
    setShared(url)
  }

  useEffect(() => {
    ipcRenderer.on(ShareEvents.SendShareUrl, updateSharedUrl)

    return () => {
      ipcRenderer.off(ShareEvents.SendShareUrl, updateSharedUrl)
    }
  }, [])

  const folderSelection = (event: any) => {
    const path = event.target.files[0].path.slice(0, event.target.files[0].path.lastIndexOf('/'))
    ipcRenderer.invoke(ShareEvents.ShareDirectory, path)
  }

  const stopSharing = () => {
    setShared(null)
    ipcRenderer.invoke(ShareEvents.StopSharing)
  }

  return (
    <>
      <nav>
        <Nav showSettings={() => setSettingsVisibility(true)}/>
      </nav>
      <main className='space-y-6'>
        <Dropzone onChange={folderSelection} />
      </main>
      <SettingsModal hidden={settingsVisible} onClose={() => setSettingsVisibility(false)}/>
      <SharingModal shared={shared} onStop={stopSharing}/>
      
      {/*<Update/>*/}
    </>
    
  )
}

export default App
