import Kbd from "@components/Kbd"
import { useLocalStorage } from "@hooks"
import { UploadIcon } from "@icons"
import useHotkeys from "@reecelucas/react-use-hotkeys"
import { LoaderState, Settings, ShareEvents } from "@shared"
import { ipcRenderer } from "electron"
import { useEffect, useRef } from "react"

interface DropzoneProps {
    onUpload: (path: string) => void
}

const Dropzone = ({ onUpload }: DropzoneProps) => {
    const ref = useRef<HTMLInputElement>(null)
    const {getValue: getSettings} = useLocalStorage<Settings | null>('settings', null)

    const openExplorer = (): void => {
        setLoading()
        ref?.current?.click()
    }

    useHotkeys(["Control+u", "Meta+u"], () => {
      if (getSettings()?.shortcuts !== false) {
        openExplorer()
      }
    })

    useEffect(() => {
        ipcRenderer.on(ShareEvents.OpenExplorer, openExplorer)
        
        return () => {
            ipcRenderer.off(ShareEvents.OpenExplorer, openExplorer)
        }
    }, [])

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.setAttribute("directory", "true")
            ref.current.setAttribute("webkitdirectory", "true")
        }
    }, [ref])

    const onShare = (files: FileList | null) => {
        setLoading(false)
        if (files?.length) {
            const path = files?.[0].path.slice(0, files?.[0].path.lastIndexOf('/'))
            onUpload(path)
        } else {
            // TODO path upload error
        }
    }

    const setLoading = (state = true): void => {
        ipcRenderer.emit(state ? LoaderState.Loading : LoaderState.StopLoading)
    }

    return (
        <div className="flex items-center justify-center w-full">
            <label tabIndex={1} htmlFor="dropzone-file" className="relative flex flex-col items-center px-4 justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-800 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
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
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-0"
                    ref={ref}
                    onChange={(event) => onShare(event?.target?.files)}
                    onClick={() => setLoading()}
                    onDrop={() => setLoading()}
                />
            </label>
        </div> 
    )
}

export default Dropzone