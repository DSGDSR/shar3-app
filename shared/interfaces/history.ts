export type History = HistoryItem[]

export interface HistoryItem {
    path: string
    sharedAt: number
}