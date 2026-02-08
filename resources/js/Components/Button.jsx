export default function Button({
    className = '',
    variant = 'primary',
    disabled,
    children,
    ...props
}) {
    const variants = {
        primary: 'from-teal-400 via-blue-500 to-purple-500',
        secondary: 'from-gray-400 via-gray-500 to-gray-600',
        danger: 'from-red-500 via-rose-500 to-pink-500',
        success: 'from-green-400 via-emerald-500 to-teal-500',
        warning: 'from-orange-400 via-amber-500 to-yellow-500',
        info: 'from-cyan-400 via-blue-500 to-indigo-500',
    };

    const gradient = variants[variant] || variants.primary;

    return (
        <button
            {...props}
            disabled={disabled}
            className={`relative group inline-block p-px font-semibold leading-6 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
                } ${className}`}
        >
            <span
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            ></span>

            <span className="relative z-10 block px-4 py-2 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <div className="relative z-10 flex items-center justify-center space-x-2">
                    {children}
                </div>
            </span>
        </button>
    );
}
