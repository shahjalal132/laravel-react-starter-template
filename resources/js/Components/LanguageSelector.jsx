import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Check, Languages } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSelector() {
    const { i18n } = useTranslation();
    const { locale } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
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
        // Update i18n immediately for instant UI feedback
        i18n.changeLanguage(langCode);
        
        // Save to backend
        router.post(route('admin.settings.update'), {
            group: 'general',
            language: langCode,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
            },
            onError: () => {
                // Revert on error
                i18n.changeLanguage(locale?.current || 'en');
            },
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Change language"
            >
                <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
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
                            className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
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
