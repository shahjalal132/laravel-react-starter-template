import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md  w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 pl-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400' +
                className
            }
            ref={localRef}
        />
    );
});

