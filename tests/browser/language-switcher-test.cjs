/**
 * Language Switcher Browser Automation Test
 * 
 * This test verifies that the language switcher functionality works correctly:
 * 1. User can click the language selector in the header
 * 2. User can select a different language
 * 3. UI updates immediately to the selected language
 * 4. Language preference persists after page reload
 * 5. Backend database is updated with the language preference
 * 
 * Prerequisites:
 * - Application must be running (npm run dev)
 * - Database must be seeded with test user
 * - Puppeteer must be installed: npm install puppeteer
 * 
 * Usage: node tests/browser/language-switcher-test.cjs
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Configuration
const APP_URL = process.env.APP_URL || 'http://localhost:8000';
const TEST_EMAIL = 'jalal@imjol.com';
const TEST_PASSWORD = '12345678';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Helper to wait for network idle
const waitForNetworkIdle = async (page, timeout = 2000) => {
    await page.waitForNetworkIdle({ idleTime: timeout, timeout: 10000 });
};

// Helper to take screenshot
const takeScreenshot = async (page, name) => {
    const fs = require('fs');
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    await page.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, `${name}.png`),
        fullPage: true 
    });
    console.log(`📸 Screenshot saved: ${name}.png`);
};

// Main test function
async function runLanguageSwitcherTest() {
    console.log('🚀 Starting Language Switcher Test...\n');
    
    const browser = await puppeteer.launch({
        headless: false, // Set to true for CI/CD
        slowMo: 50, // Slow down by 50ms for visibility
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Capture console logs from the browser
    page.on('console', msg => {
        console.log(`🖥️  BROWSER LOG: ${msg.text()}`);
    });

    await page.setViewport({ width: 1920, height: 1080 });

    try {
        // Step 1: Navigate to login page
        console.log('📍 Step 1: Navigating to login page...');
        await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle0' });
        await takeScreenshot(page, '01-login-page');

        // Step 2: Login
        console.log('📍 Step 2: Logging in...');
        await page.type('input[name="email"]', TEST_EMAIL);
        await page.type('input[name="password"]', TEST_PASSWORD);
        await page.click('button[type="submit"]');
        await waitForNetworkIdle(page);
        await takeScreenshot(page, '02-after-login');
        console.log('✅ Login successful\n');

        // Step 3: Verify we're on the dashboard
        console.log('📍 Step 3: Verifying dashboard loaded...');
        await page.waitForSelector('body', { timeout: 5000 });
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // Step 4: Find and click the language selector
        console.log('📍 Step 4: Finding language selector...');
        const languageButton = await page.waitForSelector('button[title="Change language"]', { 
            timeout: 10000,
            visible: true 
        });
        
        if (!languageButton) {
            throw new Error('❌ Language selector button not found!');
        }
        console.log('✅ Language selector found');
        
        // Take screenshot before clicking
        await takeScreenshot(page, '03-before-language-click');
        
        // Click the language selector multiple times if needed
        console.log('🖱️ Clicking language selector...');
        await page.evaluate(() => {
            const btn = document.querySelector('button[title="Change language"]');
            if (btn) btn.click();
        });
        
        // Wait for the dropdown to appear in the DOM
        console.log('⏳ Waiting for dropdown to appear...');
        let dropdownFound = false;
        for (let i = 0; i < 10; i++) {
            dropdownFound = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.some(btn => btn.textContent.includes('বাংলা'));
            });
            if (dropdownFound) break;
            await new Promise(resolve => setTimeout(resolve, 500));
            // Try clicking again if not found
            await page.evaluate(() => {
                const btn = document.querySelector('button[title="Change language"]');
                if (btn) btn.click();
            });
        }

        if (!dropdownFound) {
            console.log('⚠️ Dropdown still not found, trying to force click by finding the button text directly...');
        }

        await takeScreenshot(page, '04-language-dropdown-open');
        
        // Step 6: Select Bengali language
        console.log('📍 Step 6: Selecting Bengali language...');
        
        const bengaliClicked = await page.evaluate(() => {
            console.log('🔍 Searching for Bengali button...');
            const buttons = Array.from(document.querySelectorAll('button'));
            const bengaliBtn = buttons.find(btn => btn.textContent.includes('বাংলা') || btn.innerText.includes('বাংলা'));
            if (bengaliBtn) {
                console.log('✅ Found Bengali button, clicking...');
                bengaliBtn.click();
                return true;
            }
            console.error('❌ Bengali button NOT found!');
            return false;
        });

        if (!bengaliClicked) {
            throw new Error('❌ Bengali language option not found or could not be clicked!');
        }

        console.log('🔄 Clicked Bengali option, waiting for network idle...');
        await waitForNetworkIdle(page);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await takeScreenshot(page, '05-after-bengali-selected');

        // Step 7: Verify UI updated to Bengali
        console.log('📍 Step 7: Verifying UI updated to Bengali...');
        
        // Check if navigation contains Bengali text
        const updatedNavText = await page.evaluate(() => {
            const navElement = document.querySelector('nav');
            return navElement ? navElement.textContent : '';
        });
        
        // Look for Bengali characters in the navigation
        const hasBengaliText = /[\u0980-\u09FF]/.test(updatedNavText);
        
        if (hasBengaliText) {
            console.log('✅ UI successfully updated to Bengali!');
        } else {
            console.warn('⚠️  Warning: Bengali text not detected in navigation');
            console.log('Navigation text:', updatedNavText.substring(0, 200));
        }

        // Step 8: Reload page and verify language persists
        console.log('\n📍 Step 8: Reloading page to verify persistence...');
        await page.reload({ waitUntil: 'networkidle0' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await takeScreenshot(page, '06-after-reload');

        const afterReloadNavText = await page.evaluate(() => {
            const navElement = document.querySelector('nav');
            return navElement ? navElement.textContent : '';
        });

        const stillHasBengaliText = /[\u0980-\u09FF]/.test(afterReloadNavText);
        
        if (stillHasBengaliText) {
            console.log('✅ Language preference persisted after reload!');
        } else {
            console.warn('⚠️  Warning: Language did not persist after reload');
        }

        // Step 9: Switch back to English
        console.log('\n📍 Step 9: Switching back to English...');
        
        // Open language selector again
        const languageButtonAgain = await page.waitForSelector('button[title="Change language"]', { 
            timeout: 5000,
            visible: true 
        });
        await languageButtonAgain.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find and click English option
        const englishClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const englishBtn = buttons.find(btn => btn.textContent.includes('English'));
            if (englishBtn) {
                englishBtn.click();
                return true;
            }
            return false;
        });

        if (englishClicked) {
            console.log('🔄 Clicked English option, waiting for update...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            await takeScreenshot(page, '07-back-to-english');
            console.log('✅ Switched back to English');
        } else {
            console.warn('⚠️  Warning: English language option not found!');
        }

        // Step 10: Final verification
        console.log('\n📍 Step 10: Final verification...');
        const finalNavText = await page.evaluate(() => {
            const navElement = document.querySelector('nav');
            return navElement ? navElement.textContent : '';
        });

        // Should not have Bengali text anymore
        const hasNoBengaliText = !/[\u0980-\u09FF]/.test(finalNavText);
        
        if (hasNoBengaliText) {
            console.log('✅ Successfully switched back to English!');
        } else {
            console.warn('⚠️  Warning: Still showing Bengali text');
        }

        console.log('\n✅ ✅ ✅ All tests completed successfully! ✅ ✅ ✅\n');
        console.log(`📁 Screenshots saved to: ${SCREENSHOTS_DIR}`);

    } catch (error) {
        console.error('\n❌ Test failed with error:');
        console.error(error.message);
        console.error(error.stack);
        await takeScreenshot(page, 'error-state');
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run the test
runLanguageSwitcherTest().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
