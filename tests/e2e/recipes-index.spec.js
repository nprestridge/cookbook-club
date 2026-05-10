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
  await page.route('**/**/dev/cookbooks', (route) => route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([]),
  }));

  await page.route('**/**/dev/recipes', (route) => route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipesApiMock),
  }));

  await page.route('**/**/dev/recipes/*/*', (route) => route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cookbookRecipesApiMock),
  }));
}

test('recipes index shows cookbooks and supports navigation', async ({ page }) => {
  await mockApiRoutes(page);
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
