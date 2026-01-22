# Language Switcher Browser Test

## Overview
Automated browser test for the language switcher functionality using Puppeteer.

## Prerequisites
1. **Install Puppeteer** (if not already installed):
   ```bash
   npm install --save-dev puppeteer
   ```

2. **Start the development server**:
   ```bash
   # Terminal 1: Start Laravel
   php artisan serve
   
   # Terminal 2: Start Vite
   npm run dev
   ```

3. **Ensure test user exists**:
   - Email: `admin@example.com`
   - Password: `password`
   
   If not, create one using:
   ```bash
   php artisan tinker
   User::factory()->create(['email' => 'admin@example.com', 'password' => bcrypt('password')]);
   ```

## Running the Test

```bash
node tests/browser/language-switcher-test.cjs
```

## What the Test Does

1. ✅ Navigates to login page
2. ✅ Logs in with test credentials
3. ✅ Finds and clicks the language selector button
4. ✅ Selects Bengali (বাংলা) from dropdown
5. ✅ Verifies UI updates to Bengali
6. ✅ Reloads page to verify language persists
7. ✅ Switches back to English
8. ✅ Verifies UI updates back to English

## Screenshots

All screenshots are saved to `tests/browser/screenshots/` directory:
- `01-login-page.png` - Initial login page
- `02-after-login.png` - After successful login
- `03-before-language-click.png` - Before opening language dropdown
- `04-language-dropdown-open.png` - Language dropdown opened
- `05-after-bengali-selected.png` - After selecting Bengali
- `06-after-reload.png` - After page reload (should still be Bengali)
- `07-back-to-english.png` - After switching back to English
- `error-state.png` - If any error occurs

## Configuration

Edit the test file to change:
- `APP_URL` - Default: `http://localhost:8000`
- `TEST_EMAIL` - Default: `admin@example.com`
- `TEST_PASSWORD` - Default: `password`

## Troubleshooting

**Test fails at login:**
- Verify the test user exists in the database
- Check that the application is running on the correct URL

**Language selector not found:**
- Ensure you're logged in as an authenticated user
- Check that `LanguageSelector` component is rendered in the layout

**UI doesn't update:**
- Verify the validation fix is applied to `SettingsUpdateRequest.php`
- Check browser console for JavaScript errors
- Ensure i18n is properly configured
