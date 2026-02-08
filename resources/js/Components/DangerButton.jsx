import Button from './Button';

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            disabled={disabled}
            variant="danger"
            className={className}
        >
            {children}
        </Button>
    );
}
