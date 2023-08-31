import { emitCustomEvent, useClickAway, useCustomEventListener } from "@hooks"
import { ContextMenuCoords, ContextMenuItems } from "@shared"
import { toggleScroll } from "@utils"
import { useEffect, useState } from "react"

const MENU_WIDTH = 161
const MENU_HEIGHT = 176

export const openContextMenu = (coords: ContextMenuCoords, menu: ContextMenuItems) => {
    emitCustomEvent('openContextMenu', {
        x: coords.x,
        y: coords.y,
        menu
    })
}

const ContextMenu = () => {
    const [open, setOpen] = useState(false)
    const [menus, setMenus] = useState<ContextMenuItems>([])
    const [position, setPosition] = useState<ContextMenuCoords>({ x: 0, y: 0 })
    const [overflowX, setOverflowX] = useState(false)
    const [overflowY, setOverflowY] = useState(false)

    const ref = useClickAway(() => {
        setOpen(false);
    });

    useCustomEventListener('openContextMenu', (data: ContextMenuCoords & {
        menu: ContextMenuItems
    }) => {
        setOpen(true)
        setPosition({ x: data.x + 1, y: data.y + 1 })
        setMenus(data.menu)
    })
    
    useEffect(() => {
        const contextMenuContainer = document.getElementById('contextMenuContainer')
        setOverflowX(position.x + MENU_WIDTH > (contextMenuContainer?.offsetWidth ?? 0))
        setOverflowY(position.y + MENU_HEIGHT > (contextMenuContainer?.offsetHeight ?? 0))

        toggleScroll(!open)
    }, [open, position])

    return <div id="contextMenuContainer" className="fixed top-0 left-0 bg-transparent z-[100] w-screen h-screen" style={{
        display: open ? 'block' : 'none'
    }}>
        <div ref={ref} id="contextMenu" style={{
            [overflowX ? 'right' : 'left']: overflowX ? (window.innerWidth - position.x) : position.x,
            [overflowY ? 'bottom' : 'top']: overflowY ? (window.innerHeight - position.y) : position.y
        }} className={`absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 ${open ? 'show' : null }`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {
                    menus.map((menu, index) => <li key={`${menu.label}${index}`}>
                        <p onClick={() => {
                            menu.action()
                            setOpen(false)
                        }} className="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            { menu.label }
                        </p>
                    </li>)
                }
            </ul>
        </div>
    </div>
}

export default ContextMenu