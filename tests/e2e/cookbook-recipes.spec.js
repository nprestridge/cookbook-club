const { test, expect } = require('@playwright/test');

const recipesApiMock = [
  {
    id: 1,
    name: 'Warm Apple Pie',
    cookbook: 'Baker\'s Almanac',
    cook: 'Nina',
    page: 34,
    link: 'https://example.com/apple-pie',
  },
];

const cookbookRecipesApiMock = [
  {
    id: 1,
    name: 'Warm Apple Pie',
    cookbook: 'Baker\'s Almanac',
    cook: 'Nina',
    page: 34,
    link: 'https://example.com/apple-pie',
  },
];

async function mockApiRoutes(page) {
  await page.route('**/cookbooks', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([]),
    });
  });

  await page.route('**/recipes', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipesApiMock),
    });
  });

  await page.route('**/recipes/*/*', (route) => {
    if (route.request().resourceType() === 'document') {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cookbookRecipesApiMock),
    });
  });
}

test('cookbook page shows recipes and allows navigation back', async ({ page }) => {
  await mockApiRoutes(page);
  await page.goto('/recipes');

  // Wait for page to fully load including API calls
  await page.waitForLoadState('networkidle');

  // Wait for recipe links to load
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
