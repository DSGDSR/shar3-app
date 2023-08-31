interface TextInputProps {
    name: string
    placeholder?: string
    className?: string
    value?: any
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

const TextInput = ({ name, placeholder, value, className, onChange }: TextInputProps) => {
    return <>
        <input
            name={name}
            type="text" placeholder={placeholder}
            defaultValue={value}
            onChange={onChange}
            className={`${className} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white`}
        />
    </>
}

export default TextInput