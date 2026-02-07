import { test, expect } from '@playwright/test';

test('app loads and settings page accessible', async ({ page }) => {
  // Capture console logs for debugging
  page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

  // 1. Verify app loads
  // Increase timeout to 60s for initial load
  console.log('Navigating to http://localhost:5173/countthosenumbers/...');
  await page.goto('http://localhost:5173/countthosenumbers/', { timeout: 60000 });

  // Wait for root to be visible
  console.log('Waiting for #root to be visible...');
  await expect(page.locator('#root')).toBeVisible({ timeout: 30000 });

  // Check title
  console.log('Checking title...');
  await expect(page).toHaveTitle(/Count Those Numbers/, { timeout: 10000 });

  // 2. Navigate to Settings
  // Navigate directly to /settings (prefixed with base) to test routing
  console.log('Navigating to settings...');
  await page.goto('http://localhost:5173/countthosenumbers/settings');

  // Check for "Game Settings" text
  console.log('Checking for "Game Settings" text...');
  await expect(page.getByText('Game Settings')).toBeVisible({ timeout: 10000 });

  // 3. Verify interaction
  // Select difficulty
  console.log('Verifying difficulty selection...');
  const difficultyDropdown = page.getByLabel('Difficulty');
  await expect(difficultyDropdown).toBeVisible();
  await difficultyDropdown.selectOption('hard');
  await expect(difficultyDropdown).toHaveValue('hard');
});
