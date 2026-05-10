const { test, expect } = require('@playwright/test');

test('recipes index shows cookbooks and supports navigation', async ({ page }) => {
  await page.goto('/recipes');

  // Page title should include 'Recipes'
  await expect(page).toHaveTitle(/Recipes/);

  // Search input should exist
  const search = page.getByLabel('Search Recipes');
  await expect(search).toBeVisible();

  // Wait for recipes to load (wait for spinner to disappear)
  await page.waitForSelector('div.recipe-list__table', { state: 'visible' });

  // There should be at least one cookbook link
  const links = page.locator('a[href*="/recipes/"]');
  await expect(links.first()).toBeVisible();

  // Click the first cookbook link and verify navigation to cookbook page
  await links.first().click();
  await expect(page).toHaveURL(/\/recipes\/.+/);
});
