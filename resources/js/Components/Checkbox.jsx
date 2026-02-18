import { useId, useEffect, useRef } from 'react';

export default function Checkbox({ className = '', indeterminate = false, id, ...props }) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate]);

    return (
        <div className={`custom-checkbox-container ${className}`}>
            <div className="custom-checkbox-round">
                <input
                    {...props}
                    ref={inputRef}
                    type="checkbox"
                    id={inputId}
                />
                <label htmlFor={inputId}></label>
            </div>
        </div>
    );
}
