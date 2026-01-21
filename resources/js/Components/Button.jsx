export default function Button({
    className = '',
    disabled,
    children,
    isActive = false,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `w-full flex items-start gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ` + className
            }
        >
            {children}
        </button>
    );
}
