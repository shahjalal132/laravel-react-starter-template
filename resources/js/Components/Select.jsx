import { forwardRef } from 'react';

export default forwardRef(function Select(
    { className = '', children, ...props },
    ref,
) {
    return (
        <select
            {...props}
            ref={ref}
            className={
                'rounded-md w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400 ' +
                className
            }
        >
            {children}
        </select>
    );
});
