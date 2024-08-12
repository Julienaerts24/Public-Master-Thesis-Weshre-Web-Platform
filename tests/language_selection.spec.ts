import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
});


test('language_selection_not_connected', async ({ page }) => {
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  await expect(page.getByAltText('setting')).toBeVisible();
  await page.getByAltText('setting').click();
  await expect(page.getByText('Language')).toBeVisible();
  await page.getByText('Language').click();
  await expect(page.getByRole('button', { name: 'fr flag' })).toBeVisible();
  await page.getByRole('button', { name: 'fr flag' }).click();

  await page.waitForURL(url => url.href.includes('/fr'));
  await expect(page.getByText('Connectez-vous pour')).toBeVisible();
  await expect(page.getByAltText('setting')).toBeVisible();
  await page.getByAltText('setting').click();
  await expect(page.getByText('Langue')).toBeVisible();
  await page.getByText('Langue').click();
  await expect(page.getByRole('button', { name: 'en flag' })).toBeVisible();
  await page.getByRole('button', { name: 'en flag' }).click();
  await page.waitForURL(url => url.href.includes('/en'));
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
});


test('language_selection_connected', async ({ page }) => {
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('playwright_test_valid@gmail.com');
  
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('playwright');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(url => url.href.includes('/myActivities'));
  await expect(page.getByText('My Activities').nth(1)).toBeVisible();

  await expect(page.getByLabel('avatar')).toBeVisible();
  await page.getByLabel('avatar').click();
  await expect(page.getByText('Language')).toBeVisible();
  await page.getByText('Language').click();
  await expect(page.getByRole('button', { name: 'fr flag' })).toBeVisible();
  await page.getByRole('button', { name: 'fr flag' }).click();

  await page.waitForURL(url => url.href.includes('/fr'));
  await expect(page.getByText('Mes Activités').nth(1)).toBeVisible();
  await expect(page.getByLabel('avatar')).toBeVisible();
  await page.getByLabel('avatar').click();
  await expect(page.getByText('Langue')).toBeVisible();
  await page.getByText('Langue').click();
  await expect(page.getByRole('button', { name: 'en flag' })).toBeVisible();
  await page.getByRole('button', { name: 'en flag' }).click();

  await page.waitForURL(url => url.href.includes('/en'));
  await expect(page.getByText('My Activities').nth(1)).toBeVisible();
});