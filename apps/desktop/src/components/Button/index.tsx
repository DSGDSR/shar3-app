const Button = ({ className, children, ...props }: any) => {
    return <button type="button" className={`w-fit text-white bg-primary hover:bg-primaryHover font-medium rounded-md px-3.5 py-2 sm:py-2.5 text-center inline-flex items-center ${className}`} {...props}>
        { children }
    </button>
}

export default Button