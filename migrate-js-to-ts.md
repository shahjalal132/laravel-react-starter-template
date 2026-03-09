# Convert Laravel React Starter Template to TypeScript

## Overview

Convert all JavaScript/JSX files to TypeScript/TSX, set up TypeScript configuration, and add proper type definitions for Inertia.js, React components, and shared application types.

## Current State

- **55 JSX files** in `resources/js/` (components, pages, layouts, contexts)
- **2 JS files**: `app.jsx`, `bootstrap.js`, `i18n.js`
- **Configuration files**: `vite.config.js`, `jsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- Uses Inertia.js with React, i18next, react-hot-toast, lucide-react
- Shared props from Laravel backend via `HandleInertiaRequests.php`

## Implementation Plan

### Phase 1: TypeScript Setup & Dependencies

1. **Install TypeScript dependencies**

- Add `typescript` as dev dependency
- Add `@types/react` and `@types/react-dom` for React types
- Add `@types/node` for Node.js types (needed for Vite config)
- Install `@inertiajs/react` types if available, or create custom types

2. **Create TypeScript configuration**

- Create `tsconfig.json` in project root with proper React/JSX settings
- Configure path aliases matching `jsconfig.json` (`@/*` paths)
- Set up strict mode and appropriate compiler options
- Include/exclude appropriate directories

3. **Create type definition files**

- Create `resources/js/types/global.d.ts` for global types (window.axios, etc.)
- Create `resources/js/types/inertia.d.ts` for Inertia.js page props based on `HandleInertiaRequests.php`:
- `auth.user` with roles and permissions
- `settings` (general, seo)
- `locale` (current, available)
- `flash` (success, error, message)
- Create `resources/js/types/ziggy.d.ts` for route helper types
- Create `resources/js/types/vite-env.d.ts` for Vite environment variables

### Phase 2: Convert Configuration Files

4. **Convert Vite configuration**

- Rename `vite.config.js` → `vite.config.ts`
- Update imports to use TypeScript syntax
- Update `resolvePageComponent` to reference `.tsx` files instead of `.jsx`
- Update `import.meta.glob` pattern to match `.tsx` files

5. **Update Tailwind configuration**

- Update `tailwind.config.js` content paths to include `**/*.tsx` files
- Keep as `.js` (Tailwind config doesn't need TypeScript)

6. **Remove or update jsconfig.json**

- Remove `jsconfig.json` (replaced by `tsconfig.json`)

### Phase 3: Convert Core Files

7. **Convert entry point**

- Rename `resources/js/app.jsx` → `resources/js/app.tsx`
- Update imports to reference `.tsx` files
- Add proper types for Inertia app setup

8. **Convert utility files**

- Rename `resources/js/bootstrap.js` → `resources/js/bootstrap.ts`
- Add type declarations for `window.axios`
- Rename `resources/js/i18n.js` → `resources/js/i18n.ts`
- Add types for i18next configuration

### Phase 4: Convert React Components & Pages

9. **Convert Context files**

- Convert `resources/js/Contexts/ThemeContext.jsx` → `ThemeContext.tsx`
- Add proper types for context value (theme, resolvedTheme, toggleTheme, setTheme)
- Type the ThemeProvider props

10. **Convert Layout components**

- Convert `resources/js/Layouts/AuthenticatedLayout.jsx` → `AuthenticatedLayout.tsx`
- Convert `resources/js/Layouts/GuestLayout.jsx` → `GuestLayout.tsx`
- Add Inertia page prop types

11. **Convert Component library** (25 components)

- Convert all files in `resources/js/Components/` from `.jsx` → `.tsx`
- Add proper prop types/interfaces for each component:
- `Button.tsx`: Props with variant, disabled, className, children
- `DataTable.tsx`: Props with columns, data, actions, callbacks
- `TextInput.tsx`, `Textarea.tsx`, `Select.tsx`: Form input props
- `Modal.tsx`: Props with open state, onClose callback
- `Checkbox.tsx`: Props with checked, indeterminate, onChange
- And all other components...
- Use React.FC or function component syntax with typed props
- Add proper event handler types (React.ChangeEvent, React.FormEvent, etc.)

12. **Convert Page components** (30 pages)

- Convert all files in `resources/js/Pages/` from `.jsx` → `.tsx`
- Add Inertia page prop interfaces for each page:
- `Pages/Auth/Login.tsx`: Props with status, canResetPassword, suspension_reason
- `Pages/Admin/Administration/Users/Index.tsx`: Props with users, roles, filters
- `Pages/Profile/Edit.tsx`: Props with user data
- And all other pages...
- Type Inertia form hooks (`useForm`) with proper data shapes
- Type router methods and callbacks
- Add proper types for `usePage().props` using Inertia types

### Phase 5: Type Definitions & Utilities

13. **Create shared type utilities**

- Create `resources/js/types/index.ts` for exporting all types
- Create `resources/js/types/components.ts` for shared component prop types
- Create `resources/js/types/pages.ts` for page prop interfaces
- Create utility types for common patterns (Pagination, Filters, etc.)

14. **Add Inertia.js type augmentation**

- Extend Inertia's `PageProps` interface with shared props from Laravel
- Ensure `usePage().props` is properly typed across the application

### Phase 6: Update Imports & References

15. **Update all import statements**

- Change all `.jsx` imports to `.tsx` (or remove extensions if configured)
- Update relative imports to use TypeScript extensions
- Ensure path aliases (`@/`) work correctly with TypeScript

16. **Update route helper**

- Ensure `route()` function from Ziggy is properly typed
- Add type definitions if needed

### Phase 7: Testing & Validation

17. **Verify build process**

- Run `npm run build` to ensure TypeScript compiles correctly
- Check for any type errors
- Verify Vite dev server works with TypeScript

18. **Fix type errors**

- Address any TypeScript compilation errors
- Add `any` types sparingly, only where necessary
- Use proper type assertions where needed

## Key Files to Modify

### Configuration

- `package.json` - Add TypeScript dependencies
- `tsconfig.json` - Create new TypeScript configuration
- `vite.config.ts` - Convert and update Vite config
- `tailwind.config.js` - Update content paths
- `jsconfig.json` - Remove (replaced by tsconfig.json)

### Type Definitions

- `resources/js/types/global.d.ts` - Global type declarations
- `resources/js/types/inertia.d.ts` - Inertia.js page props
- `resources/js/types/ziggy.d.ts` - Route helper types
- `resources/js/types/vite-env.d.ts` - Vite environment types
- `resources/js/types/index.ts` - Type exports

### Core Files

- `resources/js/app.tsx` - Main entry point
- `resources/js/bootstrap.ts` - Bootstrap utilities
- `resources/js/i18n.ts` - i18n configuration

### All Component & Page Files

- All 55 files in `resources/js/Components/`, `resources/js/Pages/`, `resources/js/Layouts/`, `resources/js/Contexts/`

## Type Safety Considerations

1. **Inertia.js Props**: Create comprehensive types based on Laravel's shared props
2. **Form Handling**: Type all form data objects used with `useForm`
3. **Event Handlers**: Properly type all React event handlers
4. **API Responses**: Type data structures received from Laravel backend
5. **Component Props**: Create interfaces for all component props
6. **Context Values**: Type all React context values
7. **Hooks**: Type custom hooks and their return values

## Migration Strategy

- Convert files incrementally, starting with core utilities and types
- Test after each major phase to catch issues early
- Maintain backward compatibility during conversion
- Use TypeScript's `any` type sparingly, only as a last resort