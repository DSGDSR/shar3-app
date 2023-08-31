export type History = HistoryItem[]

export interface HistoryItem {
    path: string
    isDirectory: boolean
    sharedAt: number
}