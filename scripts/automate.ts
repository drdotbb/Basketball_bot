import { chromium, Browser, Page, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Main automation script
 * This script runs your automated actions
 * Customize the runAutomation function with your specific actions
 */
async function runAutomation() {
  let browser: Browser | null = null;
  let page: Page | null = null;
  const startTime = Date.now();

  try {
    console.log('Starting automation...');
    
    // Launch browser with headless-specific optimizations
    browser = await chromium.launch({
      headless: false, // Set to false for debugging
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      // Headless mode optimizations
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    
    page = await context.newPage();
    
     // Navigate to sign-in page
      await page.goto('https://anc.ca.apm.activecommunities.com/burnaby/signin');

      // Fill in credentials - Playwright auto-waits for elements to be ready
      const email = process.env.EMAIL;
      const password = process.env.PASSWORD;
      
      if (!email || !password) {
        throw new Error('EMAIL and PASSWORD environment variables must be set in .env file');
      }
      console.log('Email:', email);
      console.log('Password:', password);
      await page.getByRole('textbox', { name: 'Email address Required' }).fill(email);
      await page.getByRole('textbox', { name: 'Password Required' }).fill(password);

      // Click sign in and wait for the next page to load
      // Better than networkidle: wait for specific element that indicates page is ready
      await Promise.all([
        page.waitForLoadState('networkidle'), // Wait for DOM to be ready (faster than networkidle)
        page.getByRole('button', { name: 'Sign in' }).click()
      ]);

      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

      await page.goto('https://anc.ca.apm.activecommunities.com/burnaby/activity/search?onlineSiteId=0&days_of_week=0010000&activity_select_param=2&center_ids=41&activity_keyword=basketball%20reserve&viewMode=list');
      await page.getByRole('button', { name: 'Reserve In Advance: Basketball Adult Enroll Now' }).click();
      
      
      // Wait for dropdown to appear, then click it
      const dropdown = page.locator('.icon.icon-caret-down');
      await dropdown.waitFor({ state: 'visible' });
      await dropdown.click();
      
      // Select Brad Bakhshandeh - wait for option to appear, then click
      const bradOption = page.locator('div').filter({ hasText: /^Brad Bakhshandeh$/ }).first();
      await bradOption.waitFor({ state: 'visible' });
      await bradOption.click();
      
      // Click fee summary button - Playwright auto-waits
      await page.getByRole('button', { name: 'Fee summary Subtotal $0.00' }).click();
      
      // Click Finish and wait for confirmation page
      await Promise.all([
        page.waitForURL('**/confirmation**', { timeout: 10000 }).catch(() => {}), // Wait for URL change if it happens
        page.getByRole('button', { name: 'Finish' }).click()
      ]);

      // Verify confirmation page loaded - use waitFor instead of expect() in standalone scripts
      await page.getByRole('heading', { name: 'Confirmation' }).waitFor({ state: 'visible' });
      await page.getByText('Your receipt #').waitFor({ state: 'visible' });
    
    
    console.log('Automation completed successfully!');

    const endTime = Date.now();
    const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Total time taken: ${elapsedSeconds} seconds`);
    
  } catch (error) {
    console.error('Automation failed:', error);
    
    // In headless mode, take a screenshot for debugging if page exists
    if (page) {
      try {
        await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
        console.log('Screenshot saved to error-screenshot.png');
      } catch (screenshotError) {
        console.log('Could not take screenshot:', screenshotError);
      }
    }
    
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the automation
runAutomation();

