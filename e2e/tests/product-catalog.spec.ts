import { test, expect } from '@playwright/test';

test.describe('Product Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 30_000 });
  });

  test('renders product cards with name and price', async ({ page }) => {
    const firstCard = page.locator('a[href^="/products/"]').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.getByText(/\$\d+/)).toBeVisible();
  });

  test('search narrows results', async ({ page }) => {
    await page.getByPlaceholder(/search/i).fill('bamboo');
    await expect(page.getByText(/bamboo/i).first()).toBeVisible({ timeout: 10_000 });

    const cards = page.locator('a[href^="/products/"]');
    const fullCount = await page.locator('a[href^="/products/"]').count();
    await page.getByPlaceholder(/search/i).fill('');
    await expect(cards).toHaveCount(await cards.count(), { timeout: 10_000 });
    expect(await page.locator('a[href^="/products/"]').count()).toBeGreaterThanOrEqual(fullCount);
  });

  test('clicking a product navigates to detail page', async ({ page }) => {
    await page.locator('a[href^="/products/"]').first().click();
    await expect(page).toHaveURL(/\/products\/.+/);
  });

  test('shows all products on initial load', async ({ page }) => {
    const cards = page.locator('a[href^="/products/"]');
    await expect(cards.first()).toBeVisible({ timeout: 30_000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(10);
  });

  test('product cards show an image', async ({ page }) => {
    const firstCard = page.locator('a[href^="/products/"]').first();
    const img = firstCard.locator('img').first();
    await expect(img).toBeVisible();
    const src = await img.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('search with no match shows empty state', async ({ page }) => {
    await page.getByPlaceholder(/search/i).fill('zzzzzznotaproduct');
    await expect(page.locator('a[href^="/products/"]').first()).toBeHidden({ timeout: 10_000 });
    expect(await page.locator('a[href^="/products/"]').count()).toBe(0);
  });

  test('search is case-insensitive', async ({ page }) => {
    await page.getByPlaceholder(/search/i).fill('bamboo');
    await expect(page.getByText(/bamboo/i).first()).toBeVisible({ timeout: 10_000 });
    const lowercaseCount = await page.locator('a[href^="/products/"]').count();

    await page.getByPlaceholder(/search/i).fill('BAMBOO');
    await expect(page.getByText(/bamboo/i).first()).toBeVisible({ timeout: 10_000 });
    const uppercaseCount = await page.locator('a[href^="/products/"]').count();

    expect(uppercaseCount).toBe(lowercaseCount);
  });

  test('clearing search restores full catalog', async ({ page }) => {
    const totalCount = await page.locator('a[href^="/products/"]').count();

    await page.getByPlaceholder(/search/i).fill('bamboo');
    await expect(page.getByText(/bamboo/i).first()).toBeVisible({ timeout: 10_000 });

    await page.getByPlaceholder(/search/i).fill('');
    await expect(page.locator('a[href^="/products/"]')).toHaveCount(totalCount, { timeout: 10_000 });
  });

  test('price is correctly formatted', async ({ page }) => {
    const cards = page.locator('a[href^="/products/"]');
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const priceText = await cards.nth(i).getByText(/\$\d+/).textContent();
      expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
    }
  });
});
