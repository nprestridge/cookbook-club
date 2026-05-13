import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes } from './test-utils';

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

test.describe('@Mobile Recipes Index - Mobile Tests', () => {

  test('mobile search functionality', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Verify search input is visible and accessible
    const searchInput = page.getByLabel('Search Recipes');
    await expect(searchInput).toBeVisible();
    
    // Test search input on mobile
    await searchInput.fill('Apple');
    
    // Wait for search results to filter
    await page.waitForTimeout(500);
    
    // Verify filtered results
    const recipeItems = page.locator('.recipe-list__row');
    const appleRecipes = recipeItems.locator('text=/Apple/i');
    await expect(appleRecipes.first()).toBeVisible();

    // Test clear search button (use more reliable selector)
    const clearButton = page.locator('.input-group-text button, button[aria-label="Clear search"], .search-clear');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(searchInput).toHaveValue('');
    }
  });

  test('mobile recipe table layout', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Verify recipe items are displayed (may not have headers on mobile)
    const recipeRows = page.locator('.recipe-list__row');
    const rowCount = await recipeRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Check mobile layout - items should stack vertically
    const firstRow = recipeRows.first();
    const firstRowBox = await firstRow.boundingBox();
    
    const secondRow = recipeRows.nth(1);
    const secondRowBox = await secondRow.boundingBox();
    
    // Rows should be stacked vertically (allow small tolerance)
    expect(secondRowBox.y).toBeGreaterThanOrEqual(firstRowBox.y + firstRowBox.height - 1);
  });

  test('mobile recipe image modal', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Find recipe with image
    const cameraIcons = page.locator('.recipe-list__camera-icon');    
    const firstIcon = cameraIcons.first();
    await expect(firstIcon).toBeVisible();
    
    // Click to open modal
    await firstIcon.click(); // Use tap for mobile
    await page.waitForTimeout(500); // Wait for modal animation
    
    // Verify modal is open
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();
    
    // Verify modal content
    const modalImage = modal.locator('img');
    await expect(modalImage).toBeVisible();
    
    // Close modal
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

  test('mobile recipe links navigation', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    
    // Add retry logic for page navigation
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        await page.goto('/recipes', { timeout: 10000 });
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        break;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await page.waitForTimeout(1000);
      }
    }

    // Find cookbook links
    const cookbookLinks = page.locator('a[href*="/recipes/"]');
    
    const firstLink = cookbookLinks.first();
    await expect(firstLink).toBeVisible();
    
    // Test tap navigation on mobile
    await firstLink.click();
    await expect(page).toHaveURL(/\/recipes\/.+/);
    
    // Verify navigation worked
    const header = page.locator('.cookbook-header');
    await expect(header).toBeVisible();
  });

  test('mobile scroll behavior', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Check if content is scrollable on mobile
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    if (bodyHeight > viewportHeight) {
      // Content should be scrollable
      await expect(page.locator('body')).toHaveCSS('overflow-y', 'auto');
      
      // Test scrolling
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      
      // Verify scroll position changed
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    }
  });

  test('mobile touch interactions', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Test touch on search input
    const searchInput = page.getByLabel('Search Recipes');
    await searchInput.click();
    await expect(searchInput).toBeFocused();

    // Test touch on clear button
    const clearButton = page.locator('.input-group-text button, button[aria-label="Clear search"], .search-clear');
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }

    // Test touch on recipe rows
    const recipeRows = page.locator('.recipe-list__row');
    const firstRow = recipeRows.first();
    await firstRow.click();
    // This test ensures touch events work correctly
  });

  test('mobile accessibility features', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');

    // Test keyboard navigation on mobile
    await page.keyboard.press('Tab');
    
    // Wait for focus to settle
    await page.waitForTimeout(100);
    
    // Verify something is focused (keyboard navigation works)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).not.toBe('BODY'); // Should not be just the body

    // Test ARIA labels on search input
    const searchInput = page.getByLabel('Search Recipes');
    const searchAriaLabel = await searchInput.getAttribute('aria-label');
    expect(searchAriaLabel).toBe('Search Recipes');

    // Test semantic structure
    const table = page.locator('[role="table"]');
    await expect(table).toBeVisible();

    const rows = page.locator('[role="row"]');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
