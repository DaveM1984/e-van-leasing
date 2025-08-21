import { test, expect } from '@playwright/test';

test('home loads and shows search', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Van leasing made simple')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search deals' })).toBeVisible();
});