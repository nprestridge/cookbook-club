import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays cookbooks', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Cookbook Club/);

    // Verify header renders
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    // Verify logo
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await expect(logo).toBeVisible();

    // Verify navigation is visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('displays navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for Cookbooks link
    const cookbooksLink = page.getByRole('link', { name: 'Cookbooks' });
    await expect(cookbooksLink).toBeVisible();

    // Check for Recipes link
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await expect(recipesLink).toBeVisible();
  });

  test('renders footer', async ({ page }) => {
    await page.goto('/');

    // Verify footer is visible
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Verify copyright text
    const copyrightText = footer.locator('text=/Nancy.*s Hearth/');
    await expect(copyrightText).toBeVisible();
  });

  test('has no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Allow for some expected React Router warnings, filter them out
    const criticalErrors = errors.filter(
      (err) => !err.includes('React Router Future Flag Warning'),
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
