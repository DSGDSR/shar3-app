import { ipcRenderer } from "electron"

const Link = ({children, url, className, ...props}: any) => {
    const onHref = () => ipcRenderer.invoke('open-link', url)

    return <span {...props} className={`cursor-pointer hover:underline ${className}`} onClick={onHref}>{children}</span>
}

export default Link