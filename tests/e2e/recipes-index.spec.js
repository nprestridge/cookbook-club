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
  {
    id: 2,
    name: 'Rosemary Chicken',
    cookbook: 'Sunday Supper',
    cook: 'Marcus',
    page: 21,
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

test('recipes index shows cookbooks and supports navigation', async ({ page }) => {
  await mockApiRoutes(page);
  await page.goto('/recipes');

  // Wait for page to fully load including API calls
  await page.waitForLoadState('networkidle');

  // Page title should include 'Recipes'
  await expect(page).toHaveTitle(/Recipes/);

  // Search input should exist
  const search = page.getByLabel('Search Recipes');
  await expect(search).toBeVisible();

  // There should be at least one cookbook link
  const links = page.locator('a[href*="/recipes/"]');
  await expect(links.first()).toBeVisible();

  // Click the first cookbook link and verify navigation to cookbook page
  await links.first().click();
  await expect(page).toHaveURL(/\/recipes\/.+/);
});
