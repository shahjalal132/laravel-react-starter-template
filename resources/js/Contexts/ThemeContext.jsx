import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('system');
    const [resolvedTheme, setResolvedTheme] = useState('light');

    // Get system preference
    const getSystemTheme = () => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return 'light';
    };

    // Resolve theme (system -> actual theme)
    const resolveTheme = (currentTheme) => {
        if (currentTheme === 'system') {
            return getSystemTheme();
        }
        return currentTheme;
    };

    // Apply theme to HTML element
    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        const actualTheme = resolveTheme(newTheme);
        
        if (actualTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        setResolvedTheme(actualTheme);
    };

    // Initialize theme on mount
    useEffect(() => {
        // Check localStorage first
        const storedTheme = localStorage.getItem('theme-preference');
        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
            setTheme(storedTheme);
            applyTheme(storedTheme);
        } else {
            // Default to system preference
            applyTheme('system');
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const currentTheme = localStorage.getItem('theme-preference') || 'system';
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Update theme when it changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme-preference', newTheme);
    };

    const setThemeValue = (newTheme) => {
        if (['light', 'dark', 'system'].includes(newTheme)) {
            setTheme(newTheme);
            localStorage.setItem('theme-preference', newTheme);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                resolvedTheme,
                toggleTheme,
                setTheme: setThemeValue,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
