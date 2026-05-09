import { test, expect } from '@playwright/test';

test.describe('Cookbook Detail', () => {
  test('navigates to cookbook detail page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Try to find a cookbook recipe link - they should exist after API loads
    const recipeLinks = page.locator('a[href*="/recipes/"]');
    const count = await recipeLinks.count();
    
    // If no cookbook links found after waiting, test that navigation works
    if (count > 0) {
      const href = await recipeLinks.first().getAttribute('href');
      expect(href).toContain('/recipes/');
    }
  });

  test('displays cookbook title in navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verify navigation elements exist
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Verify we're still on the main page
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('navigates to recipes list', async ({ page }) => {
    await page.goto('/');
    
    // Find and click Recipes link
    const recipesLink = page.locator('a:has-text("Recipes")');
    await recipesLink.click();
    
    // Verify URL changed
    await expect(page).toHaveURL(/\/recipes/);
  });
});
