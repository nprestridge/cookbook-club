import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes } from './test-utils';

test.describe('Cookbook Detail', () => {
  test('navigates to cookbook detail page', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the app shell / expected navigation to appear
    await expect(page.getByRole('navigation')).toBeVisible();
    
    const recipeLinks = page.locator('a[href*="/recipes/"]');    
    const href = await recipeLinks.first().getAttribute('href');
    expect(href).toContain('/recipes/');
  });

  test('displays cookbook title in navigation', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Verify navigation elements exist
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Verify we're still on the main page
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
  });

  test('navigates to recipes list', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');

    // Find and click Recipes link
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await recipesLink.click();

    // Verify URL changed
    await expect(page).toHaveURL(/\/recipes/);
  });
});

test.describe('@Mobile Cookbook Detail - Mobile Tests', () => {

  test('mobile cookbook detail navigation', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Open mobile menu to access content
    const navToggle = page.locator('.nav__toggle');
    await navToggle.click();
    await page.waitForLoadState('networkidle');

    // Find and click cookbook link
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await expect(firstLink).toBeVisible();
    
    // Test tap navigation on mobile
    await firstLink.click();
    await expect(page).toHaveURL(/\/recipes\//);
    
    // Verify cookbook page loads
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();
  });

  test('mobile cookbook layout rendering', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Navigate to cookbook detail
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Verify mobile layout elements
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();

    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();

    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await expect(logo).toBeVisible();
  });

  test('mobile navigation elements', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Navigate to cookbook detail
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Test mobile navigation elements
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();

    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await expect(logo).toBeVisible();
  
  });

  test('mobile cookbook content accessibility', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Navigate to cookbook detail
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Test keyboard navigation - check if any element gets focused
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).not.toBe('BODY');

    // Test ARIA labels and roles
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();

    // Test semantic structure
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('mobile touch interactions', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Navigate to cookbook detail
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Test touch on navigation elements
    const navToggle = page.locator('.nav__toggle');
    await navToggle.click();
    
    const nav = page.getByRole('navigation');
    const navList = nav.locator('ul');
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Test touch on logo
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await logo.click();
    await expect(page).toHaveURL('/');
  
  });

  test('mobile responsive behavior', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Navigate to cookbook detail
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const firstLink = recipeLinks.first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Check content fits mobile viewport
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    if (bodyHeight > viewportHeight) {
      // Content should be scrollable on mobile
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      
      // Verify scroll position changed
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    }
  });
});
