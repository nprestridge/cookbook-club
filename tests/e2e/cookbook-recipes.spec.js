const { test, expect } = require('@playwright/test');

test('cookbook page shows recipes and allows navigation back', async ({ page }) => {
  await page.goto('/recipes');

  const first = page.locator('a[href*="/recipes/"]').first();
  await expect(first).toBeVisible();
  await first.click();

  await expect(page).toHaveURL(/\/recipes\/.+/);

  // Expect recipe list/table or heading to be visible
  const list = page.locator('table, ul');
  await expect(list.first()).toBeVisible();

  // Navigate back to index and verify URL
  await page.goBack();
  await expect(page).toHaveURL('/recipes');
});
