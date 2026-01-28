import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Check, Languages, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const { locale, settings } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    // Sync i18n with backend locale
    useEffect(() => {
        if (locale?.current && i18n.language !== locale.current) {
            i18n.changeLanguage(locale.current);
        }
    }, [locale?.current, i18n]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (langCode) => {
        if (isLoading) return;
        
        setIsLoading(true);
        const previousLang = i18n.language;
        
        // Update i18n immediately for instant UI feedback
        i18n.changeLanguage(langCode);
        
        // Save to backend
        const generalSettings = settings?.general || {};
        
        const payload = {
            group: 'general',
            language: langCode,
            app_name: generalSettings.app_name || 'Expense Tracker',
            app_email: generalSettings.app_email || 'admin@example.com',
            app_phone: generalSettings.app_phone || '',
            app_address: generalSettings.app_address || '',
        };
        
        const targetRoute = route('admin.settings.update');
        
        router.post(targetRoute, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                setIsLoading(false);
                toast.success(`Language changed to ${languages.find(l => l.code === langCode)?.name}`);
            },
            onError: (errors) => {
                // Revert on error
                i18n.changeLanguage(previousLang);
                setIsLoading(false);
                const errorMessage = errors.language?.[0] || 'Failed to change language. Please try again.';
                toast.error(errorMessage);
            },
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Change language"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-300 animate-spin" />
                ) : (
                    <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Select Language
                        </p>
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            disabled={isLoading || i18n.language === lang.code}
                            className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                i18n.language === lang.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{lang.flag}</span>
                                <span className={`text-sm font-medium ${
                                    i18n.language === lang.code 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                    {lang.name}
                                </span>
                            </div>
                            {i18n.language === lang.code && (
                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
