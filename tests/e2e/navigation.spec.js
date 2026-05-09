import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('links between pages work', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Click Recipes link
    const recipesLink = page.locator('a:has-text("Recipes")');
    await recipesLink.click();
    
    // Verify URL changed to recipes
    await expect(page).toHaveURL(/\/recipes$/);
    
    // Click back to Cookbooks
    const cookbooksLink = page.locator('a:has-text("Cookbooks")');
    await cookbooksLink.click();
    
    // Verify URL changed back to home
    await expect(page).toHaveURL('/');
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/recipes');
    
    // Find and click logo
    const logo = page.locator('a img[alt="Cookbook Club"]').locator('..');
    await logo.click();
    
    // Verify we're back at home
    await expect(page).toHaveURL('/');
  });

  test('navigation is visible on all pages', async ({ page }) => {
    // Test on homepage
    await page.goto('/');
    let nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test on recipes page
    await page.goto('/recipes');
    nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
