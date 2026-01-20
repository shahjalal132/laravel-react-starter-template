import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeToggle() {
    const { resolvedTheme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle theme"
        >
            {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
        </button>
    );
}
