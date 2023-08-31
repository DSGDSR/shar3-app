import { openContextMenu } from "@components/ContextMenu"
import { useRerenderer } from "@hooks"
import { FileIcon, FolderIcon } from "@icons"
import { History, HistoryItem, Locale, ShareEvents, Translator } from "@shared"
import { from, isWindows } from "@utils"
import { ipcRenderer } from "electron"
import { Dispatch, MouseEvent as ME, SetStateAction, useState } from "react"
import { toast } from "sonner"

interface HistoryProps {
    history: History
    locale: Locale
    setHistory: Dispatch<SetStateAction<History>>
    T: Translator
}

const evenClasses = 'flex py-[1.15rem] border-b bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer first:rounded-t-md last:rounded-b-md'
const oddClasses = 'flex py-[1.15rem] bg-white bg-gray-50 border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer last:rounded-b-md'
const pathSlash = isWindows() ? '\\' : '/'

const HistoryTable = ({history, locale, setHistory, T}: HistoryProps) => {
    const [visibleItems, setVisibleItems] = useState(5)
    const getFolderName = (path: string) => path.slice(path.lastIndexOf(pathSlash) + 1)

    const shareHistoryItem = (item: HistoryItem) => ipcRenderer.invoke(ShareEvents.ShareDirectory, item.path)

    const loadMore = (): void => {
        setVisibleItems(visibleCount => visibleCount + 5)
    }

    const deleteHistoryEntry = (historyItem: HistoryItem) => {
        setHistory((currHistory) => currHistory.filter(hi => hi.sharedAt !== historyItem.sharedAt))
        toast.success(T('toasts.delete_entry', {
            filename: getFolderName(historyItem.path)
        }))
    }

    const contextMenu = (e: ME<HTMLLIElement, MouseEvent>, historyItem: HistoryItem): void => {
        openContextMenu({
            x: e.clientX,
            y: e.clientY
        }, [
            {
                label: T('contextmenu.reshare'),
                action: () => shareHistoryItem(historyItem)
            },
            {
                label: T('contextmenu.open_folder'),
                action: () => openFolder(historyItem.path)
            },
            {
                label: T('contextmenu.delete_entry'),
                action: () => deleteHistoryEntry(historyItem)
            }
        ])
    }

    const openFolder = (path: string): void => {
        ipcRenderer.invoke(ShareEvents.OpenFolder, path)
    }

    // Rerenderer (10 secs)
    useRerenderer()

    return <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <ul className="flex text-sm text-left text-gray-600 dark:text-gray-400 w-full flex-col">
            { history.slice(0, visibleItems).map((historyItem, idx) => {
                return <li
                    key={idx}
                    tabIndex={1}
                    className={idx%2 ? oddClasses : evenClasses}
                    onClick={(e) => shareHistoryItem(historyItem)}
                    onKeyDown={(event) => {
                        if (['Enter', 'Space'].includes(event?.code)) shareHistoryItem(historyItem)
                    }}
                    onContextMenu={(e) => contextMenu(e, historyItem)}
                >
                    <header className="flex w-4/6 lg:w-5/6 items-center space-x-5 pl-6 pr-4 rounfed font-medium text-gray-900 dark:text-white">
                        <div className="w-[20px]">
                            { historyItem.isDirectory ? <FolderIcon width={20} height={20}/> : <FileIcon width={20} height={20}/> }
                        </div>
                        <div className="flex flex-col w-[80%]">
                            <p className="overflow-hidden text-ellipsis" title={getFolderName(historyItem.path)}>{getFolderName(historyItem.path)}</p>
                            <span className="text-[.65rem] font-light whitespace-nowrap overflow-hidden text-ellipsis text-left rtl">
                                { isWindows() ? historyItem.path : historyItem.path.replace('/', '') }
                            </span>
                        </div>
                    </header>
                    <time className="flex items-center pr-6 pl-4 w-2/6 lg:w-1/6 justify-end text-end">
                        {from(locale, new Date(historyItem.sharedAt))}
                    </time>
                </li>
            }) }
            { history.length > visibleItems
                ? <li tabIndex={1} key={history.length + 1} className={`${visibleItems%2 ? oddClasses : evenClasses}`} onClick={loadMore}>
                    <p className="w-full text-center font-medium">Load more...</p>
                </li> : <></>
            }
        </ul>
    </div>
}

export default HistoryTable