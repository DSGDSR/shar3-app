import Kbd from "@components/Kbd"
import { UploadIcon } from "@icons"
import { Settings, Translator } from "@shared"
import { isMac } from "@utils"

interface DropdownPlaceholderProps {
    getSettings: () => Settings | null
    T: Translator
}

const DropdownPlaceholder = ({ getSettings, T }: DropdownPlaceholderProps) => {
    return <div className="flex flex-col items-center justify-center">
        <UploadIcon className="mb-3"/>
        <p className="mt-3 text-sm sm:text-base text-center text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{T('generic.click_select')}</span>{T('generic.or_drag')}
        </p>
        {
            getSettings()?.shortcuts !== false ? <p className="text-center mt-4">
                <span className="text-gray-500 dark:text-gray-400">
                    <Kbd>Ctrl</Kbd> + <Kbd>U</Kbd> { isMac() ? <>
                        <span className="text-xs sm:text-sm mx-1.5">{T('generic.or')}</span> <Kbd>Cmd</Kbd> + <Kbd>U</Kbd>
                    </> : <></> }
                </span>
            </p> : <></>
        } 
    </div>
}

export default DropdownPlaceholder