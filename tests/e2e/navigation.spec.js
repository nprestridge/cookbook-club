import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('links between pages work', async ({ page }) => {
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
    await page.goto('/recipes');

    // Find and click logo
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await logo.click();

    // Verify we're back at home
    await expect(page).toHaveURL('/');
  });

  test('navigation is visible on all pages', async ({ page }) => {
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
