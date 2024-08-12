import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/en/login');
});


test('darkmode', async ({ page }) => {

  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  const text_light = page.getByText('Login to meet amazing people');
  const initialColor_text = await text_light.evaluate(el => {
    return window.getComputedStyle(el).getPropertyValue('color');
  });
  expect(initialColor_text).toBe('rgb(0, 0, 0)');

  await expect(page.getByAltText('setting')).toBeVisible();
  await page.getByAltText('setting').click();
  await page.getByText('Dark Mode').click();

  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  const text_dark = page.getByText('Login to meet amazing people');
  const finalColor_text = await text_dark.evaluate(el => {
    return window.getComputedStyle(el).getPropertyValue('color');
  });
  expect(finalColor_text).toBe('rgb(255, 255, 255)');

  const lightModeVisible = await page.getByText('Light Mode').isVisible();

  if (!lightModeVisible) {
    await expect(page.getByAltText('setting')).toBeVisible();
    await page.getByAltText('setting').click();
  }

  await page.getByText('Light Mode').click();
  await expect(page.getByText('Login to meet amazing people')).toBeVisible();
  const text_light_final = page.getByText('Login to meet amazing people');
  const finalLightColor_text = await text_light_final.evaluate(el => {
    return window.getComputedStyle(el).getPropertyValue('color');
  });
  expect(finalLightColor_text).toBe('rgb(0, 0, 0)');
});