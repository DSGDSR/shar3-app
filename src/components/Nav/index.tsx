import { SettingsIcon, SunIcon, PlusIcon } from "@icons";
import { ShareEvents, Translator } from "@shared";
import { ipcRenderer } from "electron";
import NavItem from "./NavItem";
import { noConnectionError } from "@utils";
import { Tooltip } from "flowbite-react";

interface NavProps {
    toggleSettings: (state: boolean) => void
    T: Translator
    isConnected: boolean
}

const Nav = ({toggleSettings, T, isConnected}: NavProps) => {
    const openExplorer = (): void => {
        if (isConnected) {
            ipcRenderer.invoke(ShareEvents.OpenExplorer)
        } else {
            noConnectionError()
        }
    }

    return (
        <div className="fixed z-50 w-72 max-w-[90%] h-16 shadow-md -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
                <NavItem key={'nav-theme'} title={T('nav.theme')} icon={<SunIcon/>} />
                
                <div className="flex items-center justify-center">
                    <Tooltip content={'New upload'} arrow={false} className="!-top-10">
                        <button type="button" onClick={openExplorer} className="inline-flex items-center justify-center w-11 h-11 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                            <PlusIcon/>
                            <span className="sr-only">{T('nav.new_item')}</span>
                        </button>
                    </Tooltip>
                </div>
                
                <NavItem key={'nav-settings'} title={T('nav.settings')} icon={<SettingsIcon/>} onClick={() => toggleSettings(true)}/>
            </div>
        </div>
    );
}

export default Nav;