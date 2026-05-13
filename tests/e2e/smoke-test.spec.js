import { test, expect } from '@playwright/test';
import { mockApiRoutes } from './test-utils';

test.describe('Smoke Tests - Verify App Structure', () => {
  
  test('homepage loads with basic elements', async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Basic smoke test - page should have a title
    await expect(page).toHaveTitle(/Cookbook/);
    
    // Debug: Print the page HTML structure
    const html = await page.content();
    console.log('=== PAGE HTML (first 2000 chars) ===');
    console.log(html.substring(0, 2000));
    console.log('=== END HTML ===');
    
    // Debug: List all links on the page
    const links = await page.locator('a').all();
    console.log(`\n=== FOUND ${links.length} LINKS ===`);
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const href = await links[i].getAttribute('href');
      const text = await links[i].textContent();
      console.log(`Link ${i}: href="${href}", text="${text?.trim()}"`);
    }
    
    // Debug: List all buttons
    const buttons = await page.locator('button').all();
    console.log(`\n=== FOUND ${buttons.length} BUTTONS ===`);
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: text="${text?.trim()}"`);
    }
    
    // Debug: List all headings
    const headings = await page.locator('h1, h2, h3').all();
    console.log(`\n=== FOUND ${headings.length} HEADINGS ===`);
    for (let i = 0; i < Math.min(headings.length, 10); i++) {
      const tag = await headings[i].evaluate(el => el.tagName);
      const text = await headings[i].textContent();
      console.log(`${tag}: "${text?.trim()}"`);
    }
    
    // Take screenshot for visual inspection
    await page.screenshot({ path: 'test-results/smoke-homepage.png', fullPage: true });
    console.log('\nScreenshot saved to test-results/smoke-homepage.png');
  });
  
  test('recipes page loads with basic elements', async ({ page }) => {
    await mockApiRoutes(page );
    await page.goto('/recipes');
    await page.waitForLoadState('networkidle');
    
    // Basic smoke test
    await expect(page).toHaveTitle(/Recipes/);
    
    // Debug: Print the page HTML structure
    const html = await page.content();
    console.log('=== RECIPES PAGE HTML (first 2000 chars) ===');
    console.log(html.substring(0, 2000));
    console.log('=== END HTML ===');
    
    // Debug: List all links on the page
    const links = await page.locator('a').all();
    console.log(`\n=== FOUND ${links.length} LINKS ===`);
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const href = await links[i].getAttribute('href');
      const text = await links[i].textContent();
      console.log(`Link ${i}: href="${href}", text="${text?.trim()}"`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/smoke-recipes.png', fullPage: true });
    console.log('\nScreenshot saved to test-results/smoke-recipes.png');
  });
  
});
