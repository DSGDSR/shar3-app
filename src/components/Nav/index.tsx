import { SettingsIcon, SunIcon, PlusIcon } from "@icons";
import { ShareEvents } from "@shared";
import { ipcRenderer } from "electron";
import NavItem from "./NavItem";

interface NavProps {
    showSettings: () => void
}

const Nav = ({showSettings}: NavProps) => {
    const openExplorer = (): void => {
        ipcRenderer.emit(ShareEvents.OpenExplorer)
    }

    return (
        <div className="fixed z-50 w-72 max-w-[90%] h-16 -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
                <NavItem key={'nav-theme'} title="Theme" icon={<SunIcon/>} className="rounded-l-full" onClick={() => null}/>
                
                <div className="flex items-center justify-center">
                    <button type="button" onClick={openExplorer} className="inline-flex items-center justify-center w-11 h-11 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
                        <PlusIcon/>
                        <span className="sr-only">New item</span>
                    </button>
                </div>
                
                <NavItem key={'nav-settings'} title="Settings" icon={<SettingsIcon/>} className="rounded-r-full" onClick={showSettings}/>
            </div>
        </div>
    );
}

export default Nav;