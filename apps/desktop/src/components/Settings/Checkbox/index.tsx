import { InfoIcon } from "@icons"
import { Tooltip } from "flowbite-react"
import { useId } from "react"

interface SettingsCheckboxProps {
    label?: string
    isChecked: boolean | null | undefined
    onChange: React.ChangeEventHandler<HTMLInputElement>
    info?: string
}

const SettingsCheckbox = ({ label, isChecked, onChange, info }: SettingsCheckboxProps) => {
    const id = useId()

    return <>
        <label key={id} className="relative flex items-center cursor-pointer">
            <input type="checkbox" checked={!!isChecked} className="sr-only peer" onChange={onChange} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-900 dark:peer-focus:ring-white dark:bg-gray-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            {label ? <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span> : <></>}
            {info ? <Tooltip className="max-w-[65%] !bg-gray-900" id={`tooltip-info-${id}`} placement="right" arrow={false} content={info}>
                <InfoIcon className="w-4 h-4 ml-3 text-gray-500 dark:text-gray-400" strokeWidth={2.5} data-tooltip-placement="right" data-tooltip-target={`tooltip-info-${id}`}/>
            </Tooltip> : <></>}
        </label>
    </>
}

export default SettingsCheckbox