import Button from './Button';

export default function SecondaryButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            disabled={disabled}
            variant="secondary"
            className={className}
        >
            {children}
        </Button>
    );
}
