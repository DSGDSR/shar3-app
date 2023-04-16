import Tooltip from "@components/Tooltip"

interface NavItemProps {
    id?: string
    title: string
    icon: any
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}

const NavItem = ({id, title, icon, onClick, className}: NavItemProps) => {
    return <>
        <button data-modal-target={`${id}-modal`} data-modal-show={`${id}-modal`} id="theme-toggle" data-tooltip-target={`tooltip-${title}`} type="button" className={`inline-flex flex-col items-center justify-center px-5 rounded-l-full rounded-r-full group ${className ?? ''}`} {...(onClick ? onClick : null)}>
            { icon }
            <span className="sr-only">{title}</span>
        </button>
        <Tooltip id={`tooltip-${title}`} text={title} />
    </>
}

export default NavItem