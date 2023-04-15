import { FolderIcon } from "@icons"
import { History } from "@shared"
import dayjs from "dayjs"

interface HistoryProps {
    history: History
}

const evenClasses = 'border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
const oddClasses = 'bg-white border-b dark:bg-gray-900 dark:border-gray-700'

const HistoryTable = ({history}: HistoryProps) => {
    const getFolderName = (path: string) => path.slice(path.lastIndexOf('/') + 1)

    return <div className="relative overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
                { history.map((historyItem, idx) => {
                    return <tr key={idx} className={idx%2 ? oddClasses : evenClasses}>
                        <th scope="row" className="flex items-center space-x-5 px-6 py-4 font-medium text-gray-900 dark:text-white">
                            <FolderIcon width={20} height={20}/>
                            <div className="flex flex-col">
                                <p>{getFolderName(historyItem.path)}</p>
                                <span className="text-[.65rem] font-light max-w-[95%] whitespace-nowrap overflow-hidden text-ellipsis text-left rtl">{historyItem.path}</span>
                            </div>
                        </th>
                        <td className="px-6 py-4s">
                            {dayjs(historyItem.sharedAt).fromNow()}
                        </td>
                    </tr>
                }) }
            </tbody>
        </table>
    </div>
}

export default HistoryTable