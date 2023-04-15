import Tooltip from "@components/Tooltip"

interface NavItemProps {
    title: string
    icon: any
    onClick: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}

const NavItem = ({title, icon, onClick, className}: NavItemProps) => {
    return <>
        <button onClick={onClick} id="theme-toggle" data-tooltip-target={`tooltip-${title}`} type="button" className={`inline-flex flex-col items-center justify-center px-5 rounded-l-full group ${className ?? ''}`}>
            { icon }
            <span className="sr-only">{title}</span>
        </button>
        <Tooltip id={`tooltip-${title}`} text={title} />
    </>
}

export default NavItem