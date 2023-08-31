import { useLocalStorage } from '@hooks'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { History, LoaderState, Settings, ShareEvents, Translator } from '@shared'
import { noConnectionError } from '@utils'
import { IpcRendererEvent, OpenDialogReturnValue, ipcRenderer } from 'electron'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DropdownPlaceholder from './Placeholder'
import Shared from './Shared'

interface DropzoneProps {
    setHistory: Dispatch<SetStateAction<History>>
    isConnected: boolean
    T: Translator
}

const defaultStyles = 'border-2 border-gray-300 border-dashed dark:border-gray-600 dark:hover:border-gray-500 bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
const sharedStyles = 'border-2 border-gray-300 border-dashed dark:border-gray-600 bg-gray-50 dark:bg-gray-800'

const Dropzone = ({ setHistory, isConnected, T }: DropzoneProps) => {
    const [shared, setShared] = useState<string | null>(null)
    const { getValue: getSettings } = useLocalStorage<Settings | null>('settings', null)

    const checkConnection = (): boolean => {
        if (!isConnected) {
            noConnectionError(T)
        }

        return isConnected
    }

    const updateSharedUrl = (_: any, path: string, url: string, isDirectory: boolean): void => {
        ipcRenderer.emit(LoaderState.StopLoading)
        // TODO error control
        setShared(url)
        setHistory((currHistory) => ([{
            path,
            isDirectory,
            sharedAt: Date.now()
        }, ...currHistory.filter(hi => hi.path !== path)]))
    }

    useEffect(() => {
        ipcRenderer.on(ShareEvents.SendShareUrl, updateSharedUrl)

        return () => {
            ipcRenderer.off(ShareEvents.SendShareUrl, updateSharedUrl)
        }
    }, [])

    const stopSharing = () => {
        setShared(null)
        ipcRenderer.invoke(ShareEvents.StopSharing)
    }

    const openExplorer = () => {
        if (checkConnection()) {
            ipcRenderer.invoke(ShareEvents.OpenExplorer)
        }
    }

    const onActivateInput = (event: any): void => {
        event?.preventDefault()
        openExplorer()
    }

    useHotkeys(["Control+u", "Meta+u"], () => {
        if (getSettings()?.shortcuts !== false) {
            openExplorer()
        }
    })

    const onShare = (event: IpcRendererEvent, path: OpenDialogReturnValue) => {
        if (!path.canceled && path.filePaths?.length && checkConnection()) {
            setLoading(true)
            onUpload(path.filePaths[0])
        }
    }

    const setLoading = (state = true): void => {
        ipcRenderer.emit(state ? LoaderState.Loading : LoaderState.StopLoading)
    }

    useEffect(() => {
        ipcRenderer.on(ShareEvents.SelectPath, onShare)

        return () => {
            ipcRenderer.off(ShareEvents.SelectPath, onShare)
        }
    }, [])

    const onDrop = (files: FileList | null) => {
        if (files?.length) {
            onUpload(files[0].path)
        } else {
            setLoading(false)
            // TODO path upload error
        }
    }

    const onUpload = (path: string) => {
        ipcRenderer.invoke(ShareEvents.ShareDirectory, path)
    }

    return (
        <div className={`relative flex items-center justify-center w-full rounded-lg transition-all h-[50vw] ${!shared ? defaultStyles : sharedStyles}`}>
            { !shared ? <label
                tabIndex={1}
                onKeyDown={(event) => {
                    if (['Enter', 'Space'].includes(event?.code)) openExplorer()
                }}
                htmlFor="dropzone-file"
                className="relative flex flex-col items-center px-4 justify-center w-full h-full cursor-pointer"
            >
                <DropdownPlaceholder getSettings={getSettings} T={T} />
                <input
                    id="dropzone-file"
                    tabIndex={-1}
                    type="file"
                    title={''}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0"
                    onChange={(event) => onDrop(event?.target?.files)}
                    onClick={onActivateInput}
                    onDrop={(event) => {
                        if (checkConnection()) {
                            setLoading()
                        } else {
                            event?.preventDefault()
                        }
                    }}
                />
            </label> : <Shared shared={shared} onStop={stopSharing} T={T} /> }
        </div>
    )
}

export default Dropzone