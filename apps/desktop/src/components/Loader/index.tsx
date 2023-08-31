import { useTheme } from '@hooks'
import { useEffect, useState } from 'react'
import { LoaderState } from '@shared'
import { ipcRenderer } from 'electron'
import './loader.css'

const Loader = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const {theme} = useTheme();

    // const toggleLoader = (_: any, state: boolean) => setLoading(state)
    const startLoading = () => {
        document.documentElement.style.overflowY = 'hidden';
        setLoading(true)
    }
    const stopLoading = () => {
        document.documentElement.style.overflowY = 'auto';
        setLoading(false)
    }

    useEffect(() => {
        // ipcRenderer.on(LoaderState.Loader, toggleLoader)
        ipcRenderer.on(LoaderState.Loading, startLoading)
        ipcRenderer.on(LoaderState.StopLoading, stopLoading)
    
        return () => {
            // ipcRenderer.off(LoaderState.Loader, toggleLoader)
            ipcRenderer.off(LoaderState.Loading, startLoading)
            ipcRenderer.off(LoaderState.StopLoading, stopLoading)
        }
    }, [])

    return <div className={`${loading ? '' : 'hidden'} absolute top-0 left-0 w-screen h-[102vh] flex items-center justify-center z-[1000] bg-[rgba(0,0,0,.4)]`}>
        <svg className="ring-loader" viewBox="25 25 50 50" strokeWidth="5">
            <circle cx="50" cy="50" r="20" />
        </svg>
    </div>
}

export default Loader