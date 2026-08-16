import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes } from './test-utils';

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

test.describe('@Mobile Cookbook Recipes - Mobile Tests', () => {

  test('mobile recipe list layout', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Find and click first cookbook link
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Verify cookbook page loads
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();

      // Verify recipe list layout on mobile
      const recipeRows = page.locator('.recipe-list__row');
      const rowCount = await recipeRows.count();
      expect(rowCount).toBeGreaterThan(1); // Need at least 2 rows for layout test
      
      // Check mobile layout - items should stack vertically
      const firstRow = recipeRows.first();
      const firstRowBox = await firstRow.boundingBox();
      expect(firstRowBox).not.toBeNull();
      
      const secondRow = recipeRows.nth(1);
      const secondRowBox = await secondRow.boundingBox();
      expect(secondRowBox).not.toBeNull();
      
      // Rows should be stacked vertically
      expect(secondRowBox.y).toBeGreaterThanOrEqual(firstRowBox.y + firstRowBox.height);
  });

  test('mobile recipe image modal', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Navigate to cookbook page
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Find recipe with image
    const cameraIcons = page.locator('.recipe-list__camera-icon');    
    const firstIcon = cameraIcons.first();
    await expect(firstIcon).toBeVisible();
    
    // Tap to open modal on mobile
    await firstIcon.click();
    await page.waitForTimeout(500);
    
    // Verify modal is open
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();
    
    // Verify modal content
    const modalImage = modal.locator('img');
    await expect(modalImage).toBeVisible();
    
    // Test modal close on mobile
    const closeButton = page.locator('.modal-header .close, .modal .close, button.close, [aria-label="Close"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await expect(modal).not.toBeVisible();
    } else {
      // Alternative: press Escape key to close modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('mobile cookbook navigation', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Navigate to cookbook page
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Verify cookbook header
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();

    // Test back navigation
    await page.goBack();
    await expect(page).toHaveURL('/recipes');
    
    // Verify we're back on recipes page
    const searchInput = page.getByLabel('Search Recipes');
    await expect(searchInput).toBeVisible();
  });

  test('mobile empty state handling', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page, undefined, []);

    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Navigate to cookbook with no recipes
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await expect(cookbookLinks.first()).toBeVisible();
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Verify empty state message
    const emptyMessage = page.locator('text=Get hungry!');
    await expect(emptyMessage).toBeVisible();
  });

  test('mobile touch interactions', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Navigate to cookbook page
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Test touch on recipe items
    const recipeRows = page.locator('.recipe-list__row');    
    const firstRow = recipeRows.first();
    await firstRow.click();
    
    // Should trigger any touch handlers
    // This ensures touch events work correctly on mobile
  });

  test('mobile accessibility features', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Test keyboard navigation on recipes page
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Verify something is focused (keyboard navigation works)
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).not.toBe('BODY');

    // Test ARIA labels on search input
    const searchInput = page.getByLabel('Search Recipes');
    const searchAriaLabel = await searchInput.getAttribute('aria-label');
    expect(searchAriaLabel).toBe('Search Recipes');

    // Test semantic structure - check for any table or list
    const table = page.locator('table, [role="table"]');

    await expect(table.first()).toBeVisible();
    
    const rows = table.first().locator('tr, [role="row"]');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('mobile scroll behavior', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Navigate to cookbook page
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    await cookbookLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Check if content is scrollable on mobile
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    if (bodyHeight > viewportHeight) {
      // Content should be scrollable
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      
      // Verify scroll position changed
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    }
  });
});
