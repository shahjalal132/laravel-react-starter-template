# Language Translation Implementation Plan

## Overview
This document outlines the implementation plan for adding multi-language support to the expense tracker application. The solution will support both frontend (React) and backend (Laravel) translations.

---

## 1. Technology Stack

### Frontend (React)
- **Library**: `react-i18next` + `i18next`
- **Features**:
  - Component-level translations
  - Dynamic language switching
  - Namespace support for organizing translations
  - Interpolation and pluralization

### Backend (Laravel)
- **Built-in**: Laravel's localization system
- **Features**:
  - Validation message translations
  - Email/notification translations
  - Server-side response translations

---

## 2. Supported Languages (Initial)
- **English (en)** - Default
- **Bengali (bn)** - Secondary
- Additional languages can be added later

---

## 3. Implementation Steps

### Phase 1: Backend Setup

#### 3.1 Database Schema
Create migration for storing user language preferences:
```
- Table: `settings` (add column if not exists)
  - `language` (string, default: 'en')
```

#### 3.2 Laravel Translation Files
Structure:
```
lang/
├── en/
│   ├── auth.php
│   ├── validation.php
│   ├── messages.php
│   └── settings.php
├── bn/
│   ├── auth.php
│   ├── validation.php
│   ├── messages.php
│   └── settings.php
```

#### 3.3 Middleware
Create `SetLocale` middleware to:
- Read user's preferred language from settings
- Set `App::setLocale()` based on user preference
- Fallback to browser's language or default (en)

#### 3.4 Controllers
Update `SettingsController` to:
- Save user's language preference
- Return current language with Inertia props

---

### Phase 2: Frontend Setup

#### 4.1 Install Dependencies
```bash
npm install i18next react-i18next i18next-http-backend i18next-browser-languagedetector
```

#### 4.2 Translation Files Structure
```
resources/js/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── settings.json
│   ├── expenses.json
│   └── navigation.json
├── bn/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── settings.json
│   ├── expenses.json
│   └── navigation.json
```

#### 4.3 i18n Configuration
Create `resources/js/i18n.js`:
- Initialize i18next
- Configure language detection
- Set fallback language
- Load translation namespaces

#### 4.4 App Integration
Update `resources/js/app.jsx`:
- Import and initialize i18n
- Wrap app with `I18nextProvider`

---

### Phase 3: Component Updates

#### 5.1 Language Switcher Component
Create `LanguageSelector.jsx`:
- Dropdown/toggle for language selection
- Display current language
- Update user preference on change
- Trigger page reload or re-render

#### 5.2 Settings Page Enhancement
Update `Settings.jsx`:
- Add "Language Preference" section
- Radio buttons or dropdown for language selection
- Save preference to backend

#### 5.3 Layout Components
Update `AuthenticatedLayout.jsx`:
- Add language switcher to header/navigation
- Pass current locale from Inertia props

---

### Phase 4: Translation Implementation

#### 6.1 Component Migration Strategy
For each component, replace hardcoded strings with translation keys:

**Before:**
```jsx
<h1>Dashboard</h1>
<button>Save</button>
```

**After:**
```jsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('dashboard');
<h1>{t('title')}</h1>
<button>{t('common:save')}</button>
```

#### 6.2 Priority Order
1. Authentication pages (Login, Register)
2. Navigation menus (Sidebar, Header)
3. Settings page
4. Dashboard
5. Expense management pages
6. Admin pages

---

### Phase 5: Backend Translation Integration

#### 7.1 Validation Messages
Update form requests to use `trans()`:
```php
'required' => trans('validation.required'),
```

#### 7.2 Flash Messages
Update controllers to use translations:
```php
return redirect()->back()->with('success', __('messages.updated_successfully'));
```

#### 7.3 Inertia Shared Data
Update `HandleInertiaRequests` middleware to share:
- Current locale
- Available languages
- Translated common messages

---

## 4. API Endpoints

### New/Updated Routes

```php
// Language preference
PUT /api/settings/language
GET /api/settings/language
```

---

## 5. Configuration Management

### Settings Page Updates
Add new tab or section for "Language Settings":
- **Language Preference**: Dropdown (English, Bengali, etc.)
- **Date Format**: Based on locale
- **Number Format**: Based on locale (comma vs dot)
- **Currency Display**: Adapt to locale

---

## 6. Translation Keys Organization

### Naming Convention
```
namespace:category.key
```

Examples:
- `common:buttons.save`
- `auth:login.title`
- `dashboard:stats.total_expenses`
- `settings:tabs.general`

### Common Keys (Reusable)
```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back"
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred"
  }
}
```

---

## 7. Dynamic Content Handling

### Database Content
For dynamic content (e.g., expense categories, descriptions):
- **Option A**: Store translations in separate columns (`name_en`, `name_bn`)
- **Option B**: Use JSON columns (`name: {en: "...", bn: "..."}`)
- **Option C**: Create a separate `translations` table (recommended for scalability)

---

## 8. Testing Strategy

### Manual Testing
- [ ] Switch language from settings
- [ ] Verify all UI text updates
- [ ] Check validation messages
- [ ] Test flash/toast notifications
- [ ] Verify email templates (if applicable)
- [ ] Test RTL layout (if adding Arabic/Persian)

### Automated Testing
- Unit tests for translation helper functions
- Feature tests for language switching
- Component tests for translated UI elements

---

## 9. Performance Considerations

### Optimization
- Lazy load translation files by namespace
- Cache translations in production
- Minimize re-renders on language change
- Use React.memo for translated components

### Bundle Size
- Tree-shake unused translations
- Split translations by route/page
- Use dynamic imports for large translation files

---

## 10. User Experience

### Language Detection Priority
1. User's saved preference (from database)
2. Browser's language setting
3. Default language (English)

### Language Switching
- Immediate UI update (no page reload)
- Persist preference to backend
- Update Inertia shared data
- Show loading state during switch

### Accessibility
- `lang` attribute on HTML tag
- ARIA labels translated
- Screen reader support

---

## 11. Future Enhancements

### Phase 2 Features
- [ ] Admin translation management UI
- [ ] Export/import translation files
- [ ] Translation progress tracking
- [ ] Community translation contributions
- [ ] Automatic translation suggestions (Google Translate API)
- [ ] RTL language support
- [ ] Region-specific variations (en-US, en-GB)

---

## 12. Migration Strategy

### Rollout Plan
1. **Week 1**: Backend setup + Database migrations
2. **Week 2**: Frontend i18n configuration + Core components
3. **Week 3**: Translate all views/components
4. **Week 4**: Testing + Bug fixes
5. **Week 5**: Bengali translations
6. **Week 6**: Production deployment

### Backward Compatibility
- Default to English if translation missing
- Log missing translation keys
- Graceful fallback for untranslated content

---

## 13. File Changes Summary

### New Files
- `app/Http/Middleware/SetLocale.php`
- `resources/js/i18n.js`
- `resources/js/Components/LanguageSelector.jsx`
- `resources/js/locales/en/*.json`
- `resources/js/locales/bn/*.json`
- `lang/en/*.php`
- `lang/bn/*.php`
- `database/migrations/xxxx_add_language_to_settings_table.php`

### Modified Files
- `app/Http/Kernel.php` (register middleware)
- `app/Http/Middleware/HandleInertiaRequests.php` (share locale)
- `resources/js/app.jsx` (i18n initialization)
- `resources/js/Pages/Admin/Settings.jsx` (add language settings)
- `resources/js/Layouts/AuthenticatedLayout.jsx` (language switcher)
- All React components (replace hardcoded strings)
- All Laravel controllers (use translation helpers)

---

## 14. Dependencies

### NPM Packages
```json
{
  "i18next": "^23.7.0",
  "react-i18next": "^14.0.0",
  "i18next-http-backend": "^2.4.0",
  "i18next-browser-languagedetector": "^7.2.0"
}
```

### No additional PHP packages required (Laravel built-in)

---

## 15. Example Code Snippets

### i18n Configuration
```javascript
// resources/js/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: require('./locales/en/common.json'),
        auth: require('./locales/en/auth.json'),
      },
      bn: {
        common: require('./locales/bn/common.json'),
        auth: require('./locales/bn/auth.json'),
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Language Switcher Component
```jsx
// resources/js/Components/LanguageSelector.jsx
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    router.put('/settings/language', { language: lang }, {
      onSuccess: () => {
        i18n.changeLanguage(lang);
      }
    });
  };

  return (
    <select 
      value={i18n.language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="bn">বাংলা</option>
    </select>
  );
}
```

### Usage in Components
```jsx
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div>
      <h1>{t('dashboard:welcome')}</h1>
      <button>{t('common:buttons.save')}</button>
    </div>
  );
}
```

---

## 16. Best Practices

1. **Consistent Key Naming**: Use dot notation and descriptive keys
2. **Namespace Organization**: Group related translations
3. **Avoid Concatenation**: Use interpolation instead
4. **Context Awareness**: Provide context for translators
5. **Pluralization**: Use i18n plural rules, not manual logic
6. **Date/Time Formatting**: Use locale-aware formatters
7. **Number Formatting**: Respect locale conventions
8. **Missing Keys**: Always provide fallback text
9. **Testing**: Test all languages before release
10. **Documentation**: Document translation process for contributors

---

## 17. Success Metrics

- [ ] All UI text translatable
- [ ] Smooth language switching (< 100ms)
- [ ] No missing translation keys in production
- [ ] User preference persists across sessions
- [ ] Server-side translations working (validation, emails)
- [ ] Accessibility maintained across languages
- [ ] Bundle size increase < 50KB per language

---

## Notes

- This is a comprehensive plan. Implementation can be done incrementally.
- Start with critical user-facing pages first (auth, dashboard).
- Bengali translations will require native speaker for quality.
- Consider hiring professional translators for production use.
- Monitor user feedback after initial release.
