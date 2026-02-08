import Button from './Button';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            disabled={disabled}
            variant="primary"
            className={className}
        >
            {children}
        </Button>
    );
}
