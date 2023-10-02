import { SettingsIcon, PlusIcon, BugIcon } from "@icons";
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
            noConnectionError(T)
        }
    }

    const reportBug = () => ipcRenderer.invoke(ShareEvents.ReportBug)

    return (
        <div className="fixed z-50 w-72 max-w-[90%] h-16 shadow-md -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-[50vw] dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
                <NavItem
                    key={'nav-bug'}
                    title={T('nav.report_bug')}
                    icon={<BugIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary"/>}
                    onClick={reportBug}
                />
                
                <div className="flex items-center justify-center">
                    <Tooltip content={T('nav.new_item')} arrow={false} className="!-top-10">
                        <button type="button" onClick={openExplorer} className="inline-flex items-center justify-center w-11 h-11 font-medium bg-primary rounded-full hover:bg-primaryHover group">
                            <PlusIcon/>
                            <span className="sr-only">{T('nav.new_item')}</span>
                        </button>
                    </Tooltip>
                </div>
                
                <NavItem
                    key={'nav-settings'}
                    title={T('nav.settings')}
                    icon={<SettingsIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary"/>}
                    onClick={() => toggleSettings(true)}
                />
            </div>
        </div>
    );
}

export default Nav;