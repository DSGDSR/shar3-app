import { FolderIcon } from "@icons"
import { History, HistoryItem, ShareEvents } from "@shared"
import { RelativeTime } from "@utils"
import { ipcRenderer } from "electron"
import { useState } from "react"

interface HistoryProps {
    history: History
}

const evenClasses = 'flex py-[1.15rem] border-b bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer first:rounded-t-md last:rounded-b-md'
const oddClasses = 'flex py-[1.15rem] bg-white bg-gray-50 border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:cursor-pointer last:rounded-b-md'

const relativeTime = new RelativeTime()

const HistoryTable = ({history}: HistoryProps) => {
    const [visibleItems, setVisibleItems] = useState(5)
    const getFolderName = (path: string) => path.slice(path.lastIndexOf('/') + 1)

    const shareHistoryItem = (item: HistoryItem) => ipcRenderer.invoke(ShareEvents.ShareDirectory, item.path)

    const loadMore = (): void => {
        setVisibleItems(visibleCount => visibleCount + 5)
    }

    return <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <table className="flex text-sm text-left text-gray-500 dark:text-gray-400 w-full">
            <tbody className="w-full">
                { history.slice(0, visibleItems).map((historyItem, idx) => {
                    return <tr tabIndex={1} key={idx} className={idx%2 ? oddClasses : evenClasses} onClick={() => shareHistoryItem(historyItem)}>
                        <th scope="row" className="flex w-4/6 lg:w-5/6 items-center space-x-5 pl-6 pr-4 rounfed font-medium text-gray-900 dark:text-white">
                            <div className="w-[20px]">
                            <FolderIcon width={20} height={20}/>
                            </div>
                            <div className="flex flex-col w-[80%]">
                                <p>{getFolderName(historyItem.path)}</p>
                                <span className="text-[.65rem] font-light whitespace-nowrap overflow-hidden text-ellipsis text-left rtl">{historyItem.path}</span>
                            </div>
                        </th>
                        <td className="flex items-center pr-6 pl-4 w-2/6 lg:w-1/6 justify-end">
                            {relativeTime.from(new Date(historyItem.sharedAt))}
                        </td>
                    </tr>
                }) }
                { history.length > visibleItems
                    ? <tr tabIndex={1} key={history.length + 1} className={`${visibleItems%2 ? oddClasses : evenClasses}`} onClick={loadMore}>
                        <td className="w-full text-center font-medium" colSpan={2}>Load more...</td>
                    </tr> : <></>
                }
            </tbody>
        </table>
    </div>
}

export default HistoryTable