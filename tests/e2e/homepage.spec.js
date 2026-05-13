import { test, expect } from '@playwright/test';
import { setMobileViewport, mockApiRoutes } from './test-utils';

test.describe('Homepage', () => {
  test('loads and displays cookbooks', async ({ page }) => {
    await mockApiRoutes(page);
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
    await mockApiRoutes(page);
    await page.goto('/');

    // Check for Cookbooks link
    const cookbooksLink = page.getByRole('link', { name: 'Cookbooks' });
    await expect(cookbooksLink).toBeVisible();

    // Check for Recipes link
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    await expect(recipesLink).toBeVisible();
  });

  test('renders footer', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Verify footer is visible
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Verify copyright text
    const copyrightText = footer.locator('text=/Nancy.*s Hearth/');
    await expect(copyrightText).toBeVisible();
  });

  test('has no console errors on load', async ({ page }) => {
    await mockApiRoutes(page);
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/', { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Allow for some expected React Router warnings and CORS errors, filter them out
    const criticalErrors = errors.filter(
      (err) => !err.includes('React Router Future Flag Warning') && !err.includes('Cross-Origin Request Blocked') && !err.includes('CORS policy') && !err.includes('ERR_FAILED'),
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('@Mobile Homepage - Mobile Tests', () => {

  test('mobile navigation toggle works', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify navigation toggle button is visible on mobile
    const navToggle = page.locator('.nav__toggle');
    await expect(navToggle).toBeVisible();

    // Verify navigation menu is initially hidden
    const navList = page.locator('ul');
    await expect(navList).not.toHaveClass(/nav__toggle--active/);

    // Click toggle to open menu
    await navToggle.click();
    await expect(navList).toHaveClass(/nav__toggle--active/);

    // Click toggle to close menu
    await navToggle.click();
    await expect(navList).not.toHaveClass(/nav__toggle--active/);
  });

  test('mobile layout displays correctly', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Verify logo is visible and properly sized
    const logo = page.getByRole('link', { name: 'Cookbook Club' });
    await expect(logo).toBeVisible();
    
    const logoImg = logo.locator('img');
    await expect(logoImg).toHaveAttribute('height', '100');
    await expect(logoImg).toHaveAttribute('width', '300');

    // Verify navigation links are accessible
    const cookbooksLink = page.getByRole('link', { name: 'Cookbooks' });
    const recipesLink = page.getByRole('link', { name: 'Recipes' });
    
    // Open mobile menu first
    const navToggle = page.locator('.nav__toggle');
    await navToggle.click();
    
    await expect(cookbooksLink).toBeVisible();
    await expect(recipesLink).toBeVisible();
  });

  test('mobile cookbook grid layout', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Verify cookbook items stack vertically on mobile
    const cookbookItems = page.locator('.cookbook-item');

    // Check that items are displayed in a single column
    const firstItem = cookbookItems.first();
    const firstItemBox = await firstItem.boundingBox();
    
    const secondItem = cookbookItems.nth(1);
    const secondItemBox = await secondItem.boundingBox();
    
    // Items should be stacked vertically (second below first)
    expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y + firstItemBox.height);

  });

  test('mobile external links work correctly', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Open mobile menu to access content
    const navToggle = page.locator('.nav__toggle');
    await navToggle.click();
    await page.waitForLoadState('networkidle');

    // Look for Amazon links in cookbook items - use flexible approach
    const allLinks = page.locator('a');
    const linkCount = await allLinks.count();
    
    // Find links that go to Amazon
    let amazonLinkCount = 0;
    for (let i = 0; i < linkCount; i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      if (href && href.includes('amazon')) {
        amazonLinkCount++;
        if (amazonLinkCount === 1) {
          await expect(allLinks.nth(i)).toBeVisible();
          
          // Test amazon link opens in new tab
          const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            allLinks.nth(i).click(),
          ]);
          await newPage.waitForLoadState('networkidle');
          await expect(newPage.url()).toContain('amazon');
          await newPage.close();
        }
      }
    }
    
    // Verify at least one Amazon link exists
    expect(amazonLinkCount).toBeGreaterThanOrEqual(1);
    
    // Look for other external links (non-Amazon)
    let externalLinkCount = 0;
    for (let i = 0; i < linkCount; i++) {
      const href = await allLinks.nth(i).getAttribute('href');
      if (href && (href.includes('http') && !href.includes('amazon') && !href.includes('localhost'))) {
        externalLinkCount++;
        if (externalLinkCount === 1) {
          await expect(allLinks.nth(i)).toBeVisible();
          
          // Test external link opens in new tab
          const [newPage2] = await Promise.all([
            page.context().waitForEvent('page'),
            allLinks.nth(i).click(),
          ]);
          await newPage2.waitForLoadState('networkidle');
          await expect(newPage2.url()).toMatch(/example\.com|localhost/);
          await newPage2.close();
        }
      }
    }
    
    // Verify at least one external link exists
    expect(externalLinkCount).toBeGreaterThanOrEqual(1);
  });

  test('mobile footer is accessible', async ({ page }) => {
    await setMobileViewport(page);
    await mockApiRoutes(page);
    await page.goto('/');

    // Verify footer is visible on mobile
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Verify copyright text
    const copyrightText = footer.locator('text=/Nancy.*s Hearth/');
    await expect(copyrightText).toBeVisible();

    // Verify footer has proper structure
    const footerBox = await footer.boundingBox();
    expect(footerBox.height).toBeGreaterThan(0); // Footer should have height
  });
});
