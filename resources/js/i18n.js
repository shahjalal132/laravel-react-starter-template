import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enSettings from './locales/en/settings.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enWelcome from './locales/en/welcome.json';
import enAdministration from './locales/en/administration.json';

import bnCommon from './locales/bn/common.json';
import bnNavigation from './locales/bn/navigation.json';
import bnSettings from './locales/bn/settings.json';
import bnAuth from './locales/bn/auth.json';
import bnProfile from './locales/bn/profile.json';
import bnWelcome from './locales/bn/welcome.json';
import bnAdministration from './locales/bn/administration.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                common: enCommon,
                navigation: enNavigation,
                settings: enSettings,
                auth: enAuth,
                profile: enProfile,
                welcome: enWelcome,
                administration: enAdministration,
            },
            bn: {
                common: bnCommon,
                navigation: bnNavigation,
                settings: bnSettings,
                auth: bnAuth,
                profile: bnProfile,
                welcome: bnWelcome,
                administration: bnAdministration,
            },
        },
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
