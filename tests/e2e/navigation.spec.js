import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes } from './test-utils';

test.describe('Navigation', () => {
  test('links between pages work', async ({ page }) => {
    await mockApiRoutes(page);
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Click Recipes link
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await recipesLink.click();

    // Verify URL changed to recipes
    await expect(page).toHaveURL(/\/recipes$/);

    // Click back to Cookbooks
    const cookbooksLink = page.getByRole('link', { name: 'Cookbooks' });
    await cookbooksLink.click();

    // Verify URL changed back to home
    await expect(page).toHaveURL('/');
  });

  test('logo links to home', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/recipes');

    // Find and click logo
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await logo.click();

    // Verify we're back at home
    await expect(page).toHaveURL('/');
  });

  test('navigation is visible on all pages', async ({ page }) => {
    await mockApiRoutes(page);
    // Test on homepage
    await page.goto('/');
    let nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
 
    // Test on recipes page
    await page.goto('/recipes');
    nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});

test.describe('@Mobile Navigation - Mobile Tests', () => {

  test('mobile menu overlay behavior', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Verify navigation toggle is visible
    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();

    // Open mobile menu
    await navToggle.click();
    
    // Wait for menu to become active
    await page.waitForTimeout(500);
    
    // Verify menu overlay covers content
    const nav = page.getByRole('navigation');
    const navList = nav.locator('ul');
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Verify links are clickable within overlay
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await expect(recipesLink).toBeVisible();
    await recipesLink.click();
    
    // Verify navigation worked (menu may or may not auto-close)
    await expect(page).toHaveURL(/\/recipes$/);
  });

  test('mobile navigation accessibility', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Test keyboard navigation for mobile menu
    const navToggle = page.locator('.nav__toggle');
    await navToggle.click();
    
    // Verify menu opens
    const nav = page.getByRole('navigation');
    const navList = nav.locator('ul');
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Test keyboard navigation through menu items
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Verify something interactive is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).not.toBe('BODY');

    // Continue tabbing and verify focus moves
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    const focusedElement2 = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement2).not.toBe('BODY');
  });

  test('mobile navigation on different pages', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    
    // Add retry logic for page navigation
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        await page.goto('/recipes', { timeout: 10000 });
        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await page.waitForTimeout(1000);
      }
    }
    
    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();
    
    // Open menu and verify functionality
    await navToggle.click();
    const nav = page.getByRole('navigation');
    const navList = nav.locator('ul');
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Click logo to navigate home
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await logo.click();
    
    // Verify URL changes (menu state may persist, that's OK)
    await expect(page).toHaveURL('/');
  });

  test('mobile navigation touch interactions', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    
    // Add retry logic for page navigation
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        await page.goto('/', { timeout: 10000 });
        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await page.waitForTimeout(1000);
      }
    }

    const navToggle = page.locator('.nav__toggle');
    
    // Test touch events (simulated by click)
    await navToggle.click();
    const nav = page.getByRole('navigation');
    const navList = nav.locator('ul');
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Test tap outside to close (if implemented)
    const main = page.locator('main');
    if (await main.isVisible()) {
      await main.click({ force: true });
    }
  });

  });
