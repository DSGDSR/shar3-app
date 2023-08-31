import { ipcRenderer } from "electron"

const Link = ({children, href, className, ...props}: any) => {
    const onHref = () => ipcRenderer.invoke('open-link', href)

    return <a tabIndex={1} {...props} role="button" className={`cursor-pointer ${className}`} onClick={onHref}>{children}</a>
}

export default Link