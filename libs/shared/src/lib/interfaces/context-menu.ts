export interface ContextMenuCoords {
    x: number
    y: number
}

export interface ContextMenuItem {
    label: string
    action: () => void
}

export type ContextMenuItems = ContextMenuItem[]