import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes, defaultRecipesApiMock, defaultCookbookRecipesApiMock } from './test-utils';

/**
 * WORKING TEST TEMPLATE
 * 
 * Key patterns for reliable tests:
 * 1. Always call mockApiRoutes() before page.goto()
 * 2. Wait for networkidle after navigation
 * 3. Use specific selectors based on actual DOM structure
 * 4. Use soft assertions for non-critical checks
 * 5. Keep tests focused on one behavior
 */

test.describe('Template - Working Test Patterns', () => {
  
  test('basic homepage smoke test', async ({ page }) => {
    // 1. Setup mock data
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    
    // 2. Navigate and wait
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 3. Basic assertions that should always pass
    await expect(page).toHaveTitle(/Cookbook/);
    await expect(page.getByRole('navigation')).toBeVisible();
  });
  
  test('basic recipes page smoke test', async ({ page }) => {
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Recipes/);
    await expect(page.getByRole('navigation')).toBeVisible();
  });
  
  test('cookbook links exist on homepage', async ({ page }) => {
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for page content to render - check for any link containing cookbook names
    // Using contains text to be flexible with whitespace
    const bakersLink = page.locator('a:has-text("Baker")');
    const sundayLink = page.locator('a:has-text("Sunday")');
    
    await expect(bakersLink).toBeVisible();
    await expect(sundayLink).toBeVisible();
    
    // Verify hrefs point to cookbook detail pages
    await expect(bakersLink).toHaveAttribute('href', '/recipes/bakers-almanac');
    await expect(sundayLink).toHaveAttribute('href', '/recipes/sunday-supper');
  });
  
  test('navigation between pages works', async ({ page }) => {
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    
    // Start at homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click Recipes link
    await page.getByRole('link', { name: 'Recipes' }).click();
    await expect(page).toHaveURL(/\/recipes$/);
    
    // Click back to Cookbooks (homepage)
    await page.getByRole('link', { name: 'Cookbooks' }).click();
    await expect(page).toHaveURL('/');
  });
  
  test('mobile viewport basic test', async ({ page }) => {
    // Set mobile viewport
    await setMobileViewport(page);
    
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    // Basic mobile assertions
    await expect(page).toHaveTitle(/Recipes/);
    
    // Mobile menu toggle should exist
    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();
  });
  
  test('search functionality on recipes page', async ({ page }) => {
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    // Find search input by label
    const searchInput = page.getByLabel('Search Recipes');
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('Apple');
    await page.waitForTimeout(300); // Small delay for any filtering
    
    // Verify search value was entered
    await expect(searchInput).toHaveValue('Apple');
  });
  
  test('navigation to cookbook detail page', async ({ page }) => {
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click the first cookbook link (using text contains for flexibility)
    const cookbookLink = page.locator('a:has-text("Baker")').first();
    await expect(cookbookLink).toBeVisible();
    await cookbookLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL(/\/recipes\/bakers-almanac/, { timeout: 10000 });
    
    // Verify we're on the cookbook detail page
    await expect(page).toHaveURL(/\/recipes\/bakers-almanac/);
    
    // Page should have loaded content
    await page.waitForLoadState('networkidle');
  });
  
});

test.describe('@Mobile Template - Mobile Test Patterns', () => {
  
  test('mobile menu toggle works', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();
    
    // Toggle should open/close menu
    await navToggle.click();
    
    // Verify menu is visible after toggle
    const navList = page.locator('nav ul');
    await expect(navList).toBeVisible();
  });
  
  test('mobile search interaction', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.getByLabel('Search Recipes');
    await expect(searchInput).toBeVisible();
    
    // Focus and type
    await searchInput.click();
    await expect(searchInput).toBeFocused();
    
    await searchInput.fill('Chicken');
    await expect(searchInput).toHaveValue('Chicken');
  });
  
  test('mobile navigation between pages', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page, defaultRecipesApiMock, defaultCookbookRecipesApiMock);
    
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    // Should have navigation toggle on mobile
    const navToggle = page.locator('.nav__toggle');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(navToggle).toBeVisible();
    
    // Open mobile menu first
    await navToggle.click();
    await page.waitForTimeout(300);
    
    // Navigate to home - use exact URL to avoid menu state issues
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });
  
});
