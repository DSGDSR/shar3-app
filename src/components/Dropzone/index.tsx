import Kbd from "@components/Kbd";
import { defaultSettings } from "@components/Settings";
import { useLocalStorage } from "@hooks";
import { UploadIcon } from "@icons";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import { ShareEvents } from "@shared";
import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

interface DropzoneProps {
    onUpload: (path: string) => void
}

const Dropzone = ({ onUpload }: DropzoneProps) => {
    const ref = useRef<HTMLInputElement>(null)
    const {getValue: getSettings} = useLocalStorage('settings', defaultSettings)

    const openExplorer = (): void => ref?.current?.click()

    useHotkeys(["Control+u", "Meta+u"], () => {
      if (getSettings().shortcuts) {
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

    const onShare = (target: HTMLInputElement) => {
        const path = target?.files?.[0].path.slice(0, target?.files?.[0].path.lastIndexOf('/'))
        if (path) {
            onUpload(path)
        } else {
            // TODO path upload error
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center px-4 justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <UploadIcon className="mb-3"/>
                    <p className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to select</span> or drag the folder here
                    </p>
                    {
                        getSettings().shortcuts ? <p className="text-center mt-4">
                            <span className="text-gray-500 dark:text-gray-400">
                                <Kbd>Ctrl</Kbd> + <Kbd>U</Kbd> <span className="text-xs mx-2">or</span> <Kbd>Cmd</Kbd> + <Kbd>U</Kbd>
                            </span>
                        </p> : <></>
                    } 
                </div>
                <input id="dropzone-file" type="file" className="hidden" ref={ref} onChange={() => onShare(event?.target as HTMLInputElement)} />
            </label>
        </div> 
    )
}

export default Dropzone