import Kbd from '@components/Kbd'
import { useLocalStorage } from '@hooks'
import { UploadIcon } from '@icons'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { LoaderState, Settings, ShareEvents, Translator } from '@shared'
import { noConnectionError } from '@utils'
import { IpcRendererEvent, OpenDialogReturnValue, ipcRenderer } from 'electron'
import { useEffect } from 'react'

interface DropzoneProps {
    onUpload: (path: string) => void
    T: Translator
    isConnected: boolean
}

const Dropzone = ({ onUpload, isConnected }: DropzoneProps) => {
    const { getValue: getSettings } = useLocalStorage<Settings | null>('settings', null)

    const checkConnection = (): boolean => {
        if (!isConnected) {
            noConnectionError()
        }

        return isConnected
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

    return (
        <div className="flex items-center justify-center w-full">
            <label
                tabIndex={1}
                onKeyDown={(event) => {
                    if (['Enter', 'Space'].includes(event?.code)) openExplorer()
                }}
                htmlFor="dropzone-file"
                className="relative flex flex-col items-center px-4 justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700"
            >
                <div className="flex flex-col items-center justify-center">
                    <UploadIcon className="mb-3"/>
                    <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to select</span> or drag the folder here
                    </p>
                    {
                        getSettings()?.shortcuts !== false ? <p className="text-center mt-4">
                            <span className="text-gray-500 dark:text-gray-400">
                                <Kbd>Ctrl</Kbd> + <Kbd>U</Kbd> <span className="text-xs mx-2">or</span> <Kbd>Cmd</Kbd> + <Kbd>U</Kbd>
                            </span>
                        </p> : <></>
                    } 
                </div>
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
            </label>
        </div> 
    )
}

export default Dropzone