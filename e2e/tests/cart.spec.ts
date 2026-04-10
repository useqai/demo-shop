import { test, expect } from '@playwright/test';

async function addFirstProductToCart(page: any) {
  await page.goto('/');
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 30_000 });
  await page.locator('a[href^="/products/"]').first().click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByRole('button', { name: 'Added!' })).toBeVisible({ timeout: 10_000 });
}

async function addNthProductToCart(page: any, index: number) {
  await page.goto('/');
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 30_000 });
  await page.locator('a[href^="/products/"]').nth(index).click();
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByRole('button', { name: 'Added!' })).toBeVisible({ timeout: 10_000 });
}

test.describe('Cart', () => {
  test('empty cart shows empty state message', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByText('Your cart is empty.')).toBeVisible({ timeout: 30_000 });
  });

  test('added item appears in cart', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
  });

  test('quantity increase button works', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByText('1').first()).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByText('2').first()).toBeVisible({ timeout: 5_000 });
  });

  test('removing item shows empty cart', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/)).toBeVisible({ timeout: 15_000 });
    // − button when qty=1 removes the item
    await page.getByRole('button', { name: '−' }).click();
    await expect(page.getByText('Your cart is empty.')).toBeVisible({ timeout: 10_000 });
  });

  test('delete button (×) removes item directly', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/)).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: '×' }).click();
    await expect(page.getByText('Your cart is empty.')).toBeVisible({ timeout: 10_000 });
  });

  test('subtotal updates when quantity changes', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/)).toBeVisible({ timeout: 15_000 });

    const subtotalBefore = await page.locator('text=/Subtotal/i').locator('..').getByText(/\$\d+\.\d{2}/).textContent();
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByText('2').first()).toBeVisible({ timeout: 5_000 });
    const subtotalAfter = await page.locator('text=/Subtotal/i').locator('..').getByText(/\$\d+\.\d{2}/).textContent();

    expect(subtotalBefore).not.toBe(subtotalAfter);
    const before = parseFloat(subtotalBefore!.replace('$', ''));
    const after = parseFloat(subtotalAfter!.replace('$', ''));
    expect(after).toBeCloseTo(before * 2, 1);
  });

  test('multiple products can be added to cart', async ({ page }) => {
    await addNthProductToCart(page, 0);
    await addNthProductToCart(page, 1);

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/).first()).toBeVisible({ timeout: 15_000 });
    const rows = page.getByRole('button', { name: '+' });
    expect(await rows.count()).toBeGreaterThanOrEqual(2);
  });

  test('cart badge shows total item count', async ({ page }) => {
    await addNthProductToCart(page, 0);
    const badge = page.getByRole('link', { name: /cart/i }).getByText(/^[1-9]\d*$/);
    await expect(badge).toBeVisible({ timeout: 10_000 });
    const countAfterFirst = parseInt(await badge.textContent() ?? '0');
    expect(countAfterFirst).toBeGreaterThanOrEqual(1);

    await addNthProductToCart(page, 1);
    const countAfterSecond = parseInt(await badge.textContent() ?? '0');
    expect(countAfterSecond).toBeGreaterThan(countAfterFirst);
  });

  test('cart persists across navigation', async ({ page }) => {
    await addFirstProductToCart(page);

    await page.goto('/');
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible({ timeout: 30_000 });

    await page.goto('/cart');
    await expect(page.getByText(/\$\d+/)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();
  });
});
