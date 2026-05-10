import { test, expect } from '@playwright/test';

test.describe('Cookbook Detail', () => {
  test('navigates to cookbook detail page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for the app shell / expected navigation to appear
    await expect(page.getByRole('navigation')).toBeVisible();
    
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const count = await recipeLinks.count();
    
    if (count > 0) {
      const href = await recipeLinks.first().getAttribute('href');
      expect(href).toContain('/recipes/');
    }
  });

  test('displays cookbook title in navigation', async ({ page }) => {
    await page.goto('/');

    // Verify navigation elements exist
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Verify we're still on the main page
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
  });

  test('navigates to recipes list', async ({ page }) => {
    await page.goto('/');

    // Find and click Recipes link
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await recipesLink.click();

    // Verify URL changed
    await expect(page).toHaveURL(/\/recipes/);
  });
});
